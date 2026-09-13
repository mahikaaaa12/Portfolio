const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sendWhatsAppNotification } = require('./whatsapp');

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variable validation on startup
function checkEnvVariables() {
  console.log('--- Checking Server Environment Configuration ---');
  const requiredVars = [
    'D360_API_KEY',
    'D360_PHONE_NUMBER',
    'D360_TEMPLATE_NAME',
    'D360_TEMPLATE_LANGUAGE'
  ];

  let missing = false;
  for (const varName of requiredVars) {
    const val = process.env[varName];
    if (!val || val.includes('your_') || val.includes('placeholder')) {
      console.warn(`⚠️ WARNING: Environment variable ${varName} is missing or contains placeholder default.`);
      missing = true;
    } else {
      console.log(`✅ ${varName} configured.`);
    }
  }

  if (missing) {
    console.warn('⚠️ 360dialog integration is unconfigured or using template defaults. Real WhatsApp messages will not be delivered until valid credentials are added to .env.');
  } else {
    console.log('🚀 360dialog Environment configuration complete.');
  }
  console.log('--------------------------------------------------');
}

checkEnvVariables();

// Middleware
app.use(express.json({ limit: '10kb' }));

// CORS configuration
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5000',
  'http://localhost:5000'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, ''));
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy rejection: Origin not allowed'));
    },
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate Limiting for Contact Route
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 contact requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact requests from this IP. Please try again later.'
  }
});

// Helper for Email validation
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'portfolio-backend' });
});

// POST /api/contact
app.post('/api/contact', contactRateLimiter, async (req, res) => {
  try {
    const { name, email, message, website } = req.body || {};

    // Honeypot check: If hidden 'website' field has any content, silently discard (bot detected)
    if (website && String(website).trim() !== '') {
      console.log('🤖 Honeypot field filled. Silently ignoring submission.');
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully.'
      });
    }

    // Input sanitization & validation
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedName || trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name (maximum 100 characters).'
      });
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail) || trimmedEmail.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!trimmedMessage || trimmedMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message (maximum 5000 characters).'
      });
    }

    // Dispatch notification via 360dialog WhatsApp API
    const result = await sendWhatsAppNotification({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully.'
      });
    } else {
      console.error('[Contact Handler Error] Failed to send WhatsApp notification:', result.error);
      return res.status(500).json({
        success: false,
        message: 'Unable to send your message. Please try again.'
      });
    }
  } catch (err) {
    console.error('[Unhandled Contact Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to send your message. Please try again.'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Portfolio Backend server running on port ${PORT}`);
});
