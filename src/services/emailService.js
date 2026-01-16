import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import config from '../config/index.js';

// Initialize SES client
const sesClient = new SESClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

/**
 * Send a contact form email via AWS SES
 * @param {Object} data - Contact form data
 * @param {string} data.name - Sender's name
 * @param {string} data.email - Sender's email
 * @param {string} data.subject - Email subject
 * @param {string} data.message - Email message
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a90a4; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .message-box { background-color: white; padding: 15px; border-left: 4px solid #4a90a4; }
          .footer { text-align: center; padding: 10px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">From:</span> ${escapeHtml(name)}
            </div>
            <div class="field">
              <span class="label">Email:</span> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
            </div>
            <div class="field">
              <span class="label">Subject:</span> ${escapeHtml(subject)}
            </div>
            <div class="field">
              <span class="label">Message:</span>
              <div class="message-box">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            Sent from adriancallies.com contact form
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `
New Contact Form Submission
============================

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from adriancallies.com contact form
  `.trim();

  const params = {
    Source: config.email.from,
    Destination: {
      ToAddresses: [config.email.to],
    },
    ReplyToAddresses: [email], // Reply goes to the person who submitted the form
    Message: {
      Subject: {
        Data: `[Contact Form] ${subject}`,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: textBody,
          Charset: 'UTF-8',
        },
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
      },
    },
  };

  const command = new SendEmailCommand(params);
  const response = await sesClient.send(command);
  
  console.log(`Email sent successfully. MessageId: ${response.MessageId}`);
  return response;
};

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}
