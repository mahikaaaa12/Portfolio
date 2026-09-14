/**
 * 360dialog WhatsApp Sandbox API Integration Service
 * 
 * Handles sending text notifications via 360dialog HTTP API.
 * Keeps 360dialog credentials and payload structure isolated from route handlers.
 */

async function sendWhatsAppNotification({ name, email, message }) {
  const apiKey = process.env.D360_API_KEY;
  const baseUrl = (process.env.D360_API_URL || 'https://waba-sandbox.360dialog.io').replace(/\/+$/, '');
  const rawRecipientNumber = process.env.MY_WHATSAPP_NUMBER || process.env.D360_PHONE_NUMBER;

  if (!apiKey || apiKey === 'your_360dialog_api_key') {
    throw new Error('D360_API_KEY is missing or unconfigured.');
  }

  if (!rawRecipientNumber || rawRecipientNumber === 'your_whatsapp_number') {
    throw new Error('MY_WHATSAPP_NUMBER is missing or unconfigured.');
  }

  // Format recipient phone number (strip '+' and non-digit characters)
  const cleanToNumber = String(rawRecipientNumber).replace(/\D/g, '');

  const endpoint = `${baseUrl}/v1/messages`;

  // Format the notification text body for WhatsApp
  const formattedBody = `📩 NEW PORTFOLIO CONTACT\n\nName: ${String(name || '').trim()}\n\nEmail: ${String(email || '').trim()}\n\nMessage:\n${String(message || '').trim()}\n\nSource: Portfolio Website`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanToNumber,
    type: 'text',
    text: {
      body: formattedBody
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
      console.error('[360dialog API Error Response]', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      return {
        success: false,
        error: `360dialog API returned status ${response.status}`
      };
    }

    console.log('[360dialog Sandbox Success]', responseData);

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
