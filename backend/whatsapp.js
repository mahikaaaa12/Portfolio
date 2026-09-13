/**
 * 360dialog WhatsApp API Integration Service
 * 
 * Handles sending WhatsApp notifications via 360dialog HTTP API.
 * Keeps 360dialog credentials and payload structure isolated from route handlers.
 */

async function sendWhatsAppNotification({ name, email, message }) {
  const apiKey = process.env.D360_API_KEY;
  const baseUrl = (process.env.D360_API_URL || 'https://waba-v2.360dialog.io').replace(/\/+$/, '');
  const phoneNumber = process.env.D360_PHONE_NUMBER;
  const templateName = process.env.D360_TEMPLATE_NAME || 'portfolio_contact_notification';
  const templateLanguage = process.env.D360_TEMPLATE_LANGUAGE || 'en';

  if (!apiKey || apiKey === 'your_360dialog_api_key') {
    throw new Error('D360_API_KEY is missing or unconfigured.');
  }

  if (!phoneNumber || phoneNumber === 'your_whatsapp_business_number') {
    throw new Error('D360_PHONE_NUMBER is missing or unconfigured.');
  }

  // Format recipient phone number (strip '+' and non-digit characters)
  const cleanToNumber = String(phoneNumber).replace(/\D/g, '');

  const endpoint = `${baseUrl}/v1/messages`;

  const payload = {
    to: cleanToNumber,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: templateLanguage
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: String(name || '').trim() },
            { type: 'text', text: String(email || '').trim() },
            { type: 'text', text: String(message || '').trim() }
          ]
        }
      ]
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': apiKey,
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[360dialog API Error]', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      return {
        success: false,
        error: `360dialog API returned status ${response.status}`
      };
    }

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('[360dialog Network Error]', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendWhatsAppNotification
};
