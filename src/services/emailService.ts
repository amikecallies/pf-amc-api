import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import config from '../config/index.js';
import type { ContactFormData } from '../types/index.js';

// Initialize SES client
const sesClient = new SESClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

/**
 * Send a contact form email via AWS SES
 */
export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}: ContactFormData): Promise<{ MessageId?: string }> => {
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0d5ade; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .message-box { background-color: white; padding: 15px; border-left: 4px solid #0d5ade; }
          .footer { text-align: center; padding: 10px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Adrian! You got a new message &#128032;</h1>
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
      ToAddresses: ['adrianm.callies@gmail.com'],
    },
    ReplyToAddresses: [email], // Reply goes to the person who submitted the form
    Message: {
      Subject: {
        Data: `[adriancallies.com - Contact Form]: ${subject}`,
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
