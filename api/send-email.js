/**
 * Vercel Serverless Function — POST /api/send-email
 *
 * Accepts a JSON inquiry payload, validates it, and sends an HTML + plain-text
 * email via SMTP using Nodemailer. Credentials are read only from server-side
 * environment variables.
 */

import nodemailer from 'nodemailer';

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  brandName: 120,
  youtubeUrl: 500,
  monthlyViews: 40,
  monthlyBudget: 40,
  message: 3000,
};

function escapeHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function truncate(value, maxLength) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function readEnv(name) {
  return String(process.env[name] ?? '').trim();
}

function buildHtmlBody({
  name,
  email,
  brandName,
  youtubeUrl,
  monthlyViews,
  monthlyBudget,
  services,
  message,
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeBrandName = escapeHtml(brandName);
  const safeYoutubeUrl = escapeHtml(youtubeUrl);
  const safeMonthlyViews = escapeHtml(monthlyViews);
  const safeMonthlyBudget = escapeHtml(monthlyBudget);
  const safeServices = services.map(escapeHtml).join(', ') || 'None selected';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New STW Media Inquiry</title>
  </head>
  <body style="margin:0;background:#0d0f10;font-family:Arial,sans-serif;color:#f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f10;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#111315;border:1px solid #25282c;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:24px 30px;background:linear-gradient(90deg,#2563eb,#3b82f6);">
                <div style="font-size:18px;font-weight:800;color:#fff;">STW Media — New Consultation Inquiry</div>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;">
                <p style="margin:0 0 22px;color:#94a3b8;font-size:13px;">A new inquiry was submitted through the STW Media website.</p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr><td style="padding:12px 0;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;">Full name</td><td style="padding:12px 0;color:#fff;font-weight:600;">${safeName}</td></tr>
                  <tr><td style="padding:12px 0;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;">Email</td><td style="padding:12px 0;color:#60a5fa;font-weight:600;">${safeEmail}</td></tr>
                  ${safeBrandName ? `<tr><td style="padding:12px 0;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;">Brand / channel</td><td style="padding:12px 0;color:#fff;font-weight:600;">${safeBrandName}</td></tr>` : ''}
                  ${safeYoutubeUrl ? `<tr><td style="padding:12px 0;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;">YouTube</td><td style="padding:12px 0;"><a href="${safeYoutubeUrl}" style="color:#60a5fa;">${safeYoutubeUrl}</a></td></tr>` : ''}
                  <tr><td style="padding:12px 0;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;">Monthly views</td><td style="padding:12px 0;color:#fff;font-weight:600;">${safeMonthlyViews}</td></tr>
                  <tr><td style="padding:12px 0;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;">Monthly budget</td><td style="padding:12px 0;color:#fff;font-weight:600;">${safeMonthlyBudget}</td></tr>
                  <tr><td style="padding:12px 0;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;vertical-align:top;">Services</td><td style="padding:12px 0;color:#fff;">${safeServices}</td></tr>
                </table>

                ${safeMessage ? `<div style="margin-top:22px;padding:18px;background:#0d0f10;border:1px solid #25282c;border-radius:10px;"><div style="margin-bottom:8px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;">Additional context</div><div style="color:#cbd5e1;font-size:13px;line-height:1.65;">${safeMessage}</div></div>` : ''}

                <p style="margin:24px 0 0;padding-top:18px;border-top:1px solid #25282c;color:#64748b;font-size:11px;">Reply to this email to respond directly to ${safeName}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildPlainText({
  name,
  email,
  brandName,
  youtubeUrl,
  monthlyViews,
  monthlyBudget,
  services,
  message,
}) {
  const lines = [
    'NEW STW MEDIA CONSULTATION INQUIRY',
    '====================================',
    '',
    `Full Name: ${name}`,
    `Email: ${email}`,
  ];

  if (brandName) lines.push(`Brand / Channel: ${brandName}`);
  if (youtubeUrl) lines.push(`YouTube URL: ${youtubeUrl}`);

  lines.push(`Monthly Views: ${monthlyViews}`);
  lines.push(`Monthly Budget: ${monthlyBudget}`);
  lines.push(`Services: ${services.length ? services.join(', ') : 'None selected'}`);

  if (message) {
    lines.push('', 'Additional Context:', message);
  }

  return lines.join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid JSON payload.' });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, error: 'Request body is required.' });
  }

  const name = truncate(String(body.name ?? '').trim(), MAX_LENGTHS.name);
  const email = truncate(String(body.email ?? '').trim(), MAX_LENGTHS.email);
  const brandName = truncate(String(body.brandName ?? '').trim(), MAX_LENGTHS.brandName);
  const youtubeUrl = truncate(String(body.youtubeUrl ?? '').trim(), MAX_LENGTHS.youtubeUrl);
  const monthlyViews = truncate(String(body.monthlyViews ?? '').trim(), MAX_LENGTHS.monthlyViews);
  const monthlyBudget = truncate(String(body.monthlyBudget ?? '').trim(), MAX_LENGTHS.monthlyBudget);
  const message = truncate(String(body.message ?? '').trim(), MAX_LENGTHS.message);
  const services = (Array.isArray(body.servicesInterested) ? body.servicesInterested : [])
    .map((service) => truncate(String(service).trim(), 80))
    .filter(Boolean)
    .slice(0, 10);

  if (!name) {
    return res.status(422).json({ success: false, error: 'Full name is required.' });
  }

  if (!email) {
    return res.status(422).json({ success: false, error: 'Email address is required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(422).json({ success: false, error: 'Please provide a valid email address.' });
  }

  const SMTP_HOST = readEnv('SMTP_HOST');
  const SMTP_PORT = readEnv('SMTP_PORT');
  const SMTP_USER = readEnv('SMTP_USER');
  const SMTP_PASS = readEnv('SMTP_PASS');
  const SMTP_FROM = readEnv('SMTP_FROM');
  const SMTP_TO = readEnv('SMTP_TO');

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !SMTP_TO) {
    console.error('[send-email] Missing required SMTP environment variables.');
    return res.status(500).json({
      success: false,
      error: 'Email service is not configured. Please contact us directly.',
    });
  }

  const port = Number.parseInt(SMTP_PORT, 10);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    console.error('[send-email] Invalid SMTP_PORT.');
    return res.status(500).json({
      success: false,
      error: 'Email service is not configured. Please contact us directly.',
    });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      servername: SMTP_HOST,
    },
  });

  const payload = {
    name,
    email,
    brandName,
    youtubeUrl,
    monthlyViews,
    monthlyBudget,
    services,
    message,
  };

  try {
    const info = await transporter.sendMail({
      from: {
        name: 'STW Media Contact Form',
        address: SMTP_FROM,
      },
      to: SMTP_TO,
      replyTo: {
        name,
        address: email,
      },
      subject: `New Consultation Inquiry from ${name}${brandName ? ` (${brandName})` : ''}`,
      text: buildPlainText(payload),
      html: buildHtmlBody(payload),
    });

    console.log('[send-email] Message sent:', info.messageId);
    return res.status(200).json({ success: true, message: 'Inquiry sent successfully.' });
  } catch (error) {
    console.error('[send-email] SMTP send failed:', {
      name: error?.name,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      message: error?.message,
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to send your inquiry. Please try again or contact us directly.',
    });
  }
}
