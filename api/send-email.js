/**
 * Vercel Serverless Function — POST /api/send-email
 *
 * Accepts a JSON inquiry payload, validates it, and sends an HTML + plain-text
 * email via SMTP using Nodemailer.  All credentials are read exclusively from
 * server-side environment variables — none are ever exposed to the Vite bundle.
 */

import nodemailer from 'nodemailer';

// ─── Field limits ────────────────────────────────────────────────────────────
const MAX_LENGTHS = {
  name: 120,
  email: 254,
  brandName: 120,
  youtubeUrl: 500,
  monthlyViews: 40,
  monthlyBudget: 40,
  services: 500, // combined string of service names
  message: 3000,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Very simple HTML-escape to prevent injection if the content is ever
 * rendered inside an HTML email body.
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isValidEmail(email) {
  // RFC-5322-lite regex — good enough for server-side validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function truncate(str, max) {
  if (typeof str !== 'string') return '';
  return str.slice(0, max);
}

function readEnv(name) {
  return String(process.env[name] ?? '').trim();
}

function summarizeSmtpError(err) {
  return {
    name: err?.name,
    code: err?.code,
    command: err?.command,
    responseCode: err?.responseCode,
    message: err?.message,
  };
}

// ─── Email builders ───────────────────────────────────────────────────────────

function buildHtmlBody({ name, email, brandName, youtubeUrl, monthlyViews, monthlyBudget, services, message }) {
  const safeName        = escapeHtml(name);
  const safeEmail       = escapeHtml(email);
  const safeBrand       = escapeHtml(brandName);
  const safeYoutube     = escapeHtml(youtubeUrl);
  const safeViews       = escapeHtml(monthlyViews);
  const safeBudget      = escapeHtml(monthlyBudget);
  const safeServices    = services.map(escapeHtml).join(', ') || 'None selected';
  const safeMessage     = escapeHtml(message).replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New STW Media Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#0d0f10;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f10;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0"
               style="background:#111315;border:1px solid #1e2124;border-radius:16px;overflow:hidden;max-width:620px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#2563eb,#3b82f6);padding:24px 32px;">
              <p style="margin:0;color:#fff;font-size:18px;font-weight:800;letter-spacing:0.5px;">
                STW Media New Consultation Inquiry
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <p style="color:#94a3b8;font-size:13px;margin:0 0 24px;">
                A new inquiry has been submitted via the STW Media contact form.
              </p>

              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#0d0f10;border:1px solid #1e2124;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #1e2124;">
                    <p style="margin:0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                    <p style="margin:4px 0 0;color:#f1f5f9;font-size:14px;font-weight:600;">${safeName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #1e2124;">
                    <p style="margin:0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Email</p>
                    <p style="margin:4px 0 0;color:#3b82f6;font-size:14px;font-weight:600;">${safeEmail}</p>
                  </td>
                </tr>
                ${safeBrand ? `
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #1e2124;">
                    <p style="margin:0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Brand / Channel</p>
                    <p style="margin:4px 0 0;color:#f1f5f9;font-size:14px;font-weight:600;">${safeBrand}</p>
                  </td>
                </tr>` : ''}
                ${safeYoutube ? `
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #1e2124;">
                    <p style="margin:0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">YouTube URL</p>
                    <p style="margin:4px 0 0;font-size:14px;"><a href="${safeYoutube}" style="color:#3b82f6;">${safeYoutube}</a></p>
                  </td>
                </tr>` : ''}
              </table>

              <!-- Stats row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="49%" style="background:#0d0f10;border:1px solid #1e2124;border-radius:10px;padding:16px 20px;">
                    <p style="margin:0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Monthly Views</p>
                    <p style="margin:4px 0 0;color:#f1f5f9;font-size:14px;font-weight:700;">${safeViews}</p>
                  </td>
                  <td width="2%"></td>
                  <td width="49%" style="background:#0d0f10;border:1px solid #1e2124;border-radius:10px;padding:16px 20px;">
                    <p style="margin:0;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Monthly Budget</p>
                    <p style="margin:4px 0 0;color:#f1f5f9;font-size:14px;font-weight:700;">${safeBudget}</p>
                  </td>
                </tr>
              </table>

              <!-- Services -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#0d0f10;border:1px solid #1e2124;border-radius:10px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Services Interested In</p>
                    <p style="margin:0;color:#f1f5f9;font-size:13px;">${safeServices}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              ${safeMessage ? `
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#0d0f10;border:1px solid #1e2124;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Additional Context</p>
                    <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">${safeMessage}</p>
                  </td>
                </tr>
              </table>` : ''}

              <p style="margin:0;color:#475569;font-size:11px;border-top:1px solid #1e2124;padding-top:20px;">
                This email was generated automatically by the STW Media contact form.
                Reply directly to this email to respond to ${safeName}.
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

function buildPlainText({ name, email, brandName, youtubeUrl, monthlyViews, monthlyBudget, services, message }) {
  const lines = [
    'NEW STW MEDIA CONSULTATION INQUIRY',
    '====================================',
    '',
    `Full Name:      ${name}`,
    `Email:          ${email}`,
  ];
  if (brandName)  lines.push(`Brand/Channel:  ${brandName}`);
  if (youtubeUrl) lines.push(`YouTube URL:    ${youtubeUrl}`);
  lines.push(`Monthly Views:  ${monthlyViews}`);
  lines.push(`Monthly Budget: ${monthlyBudget}`);
  lines.push(`Services:       ${services.length ? services.join(', ') : 'None selected'}`);
  if (message) {
    lines.push('');
    lines.push('Additional Context:');
    lines.push(message);
  }
  lines.push('');
  lines.push('---');
  lines.push('Sent via STW Media contact form. Reply to this email to reach the sender.');
  return lines.join('\n');
}

// ─── Serverless handler ───────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Only POST is allowed
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  // ── Parse body ──
  let body = req.body;

  // Vercel parses JSON automatically when Content-Type is application/json,
  // but guard against string bodies from unusual clients.
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

  // ── Extract + coerce fields ──
  const name         = truncate(String(body.name         ?? '').trim(), MAX_LENGTHS.name);
  const email        = truncate(String(body.email        ?? '').trim(), MAX_LENGTHS.email);
  const brandName    = truncate(String(body.brandName    ?? '').trim(), MAX_LENGTHS.brandName);
  const youtubeUrl   = truncate(String(body.youtubeUrl   ?? '').trim(), MAX_LENGTHS.youtubeUrl);
  const monthlyViews = truncate(String(body.monthlyViews ?? '').trim(), MAX_LENGTHS.monthlyViews);
  const monthlyBudget= truncate(String(body.monthlyBudget?? '').trim(), MAX_LENGTHS.monthlyBudget);
  const rawServices  = Array.isArray(body.servicesInterested) ? body.servicesInterested : [];
  const services     = rawServices
    .map(s => truncate(String(s).trim(), 80))
    .filter(Boolean)
    .slice(0, 10); // max 10 services
  const message      = truncate(String(body.message ?? '').trim(), MAX_LENGTHS.message);

  // ── Validate required fields ──
  if (!name) {
    return res.status(422).json({ success: false, error: 'Full name is required.' });
  }
  if (!email) {
    return res.status(422).json({ success: false, error: 'Email address is required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(422).json({ success: false, error: 'Please provide a valid email address.' });
  }

  // ── Read SMTP config from environment (never from the request) ──
  const SMTP_HOST = readEnv('SMTP_HOST');
  const SMTP_PORT = readEnv('SMTP_PORT');
  const SMTP_USER = readEnv('SMTP_USER');
  const SMTP_PASS = readEnv('SMTP_PASS');
  const SMTP_FROM = readEnv('SMTP_FROM');
  const SMTP_TO = readEnv('SMTP_TO');

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !SMTP_TO) {
    // Log detail server-side, return generic message to client
    console.error('[send-email] Missing one or more required SMTP environment variables.', {
      SMTP_HOST: Boolean(SMTP_HOST),
      SMTP_PORT: Boolean(SMTP_PORT),
      SMTP_USER: Boolean(SMTP_USER),
      SMTP_PASS: Boolean(SMTP_PASS),
      SMTP_FROM: Boolean(SMTP_FROM),
      SMTP_TO: Boolean(SMTP_TO),
    });
    return res.status(500).json({
      success: false,
      error: 'Email service is not configured. Please contact us directly.',
    });
  }

  const port = parseInt(SMTP_PORT, 10);
  if (!Number.isInteger(port)) {
    console.error('[send-email] Invalid SMTP_PORT value.');
    return res.status(500).json({
      success: false,
      error: 'Email service is not configured. Please contact us directly.',
    });
  }

  const secure = port === 465; // STARTTLS for 587, SSL/TLS for 465

  // ── Create transporter ──
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
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

  // ── Build email content ──
  const payload = { name, email, brandName, youtubeUrl, monthlyViews, monthlyBudget, services, message };
  const subjectLine = `New Consultation Inquiry from ${name}${brandName ? ` (${brandName})` : ''}`;

  const mailOptions = {
    from: {
      name: 'STW Media Contact Form',
      address: SMTP_FROM,
    },
    to: SMTP_TO,
    replyTo: {
      name,
      address: email,
    },
    subject: subjectLine,
    text: buildPlainText(payload),
    html: buildHtmlBody(payload),
  };

  // ── Send ──
  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('[send-email] Message sent:', info.messageId);
    return res.status(200).json({ success: true, message: 'Inquiry sent successfully.' });
  } catch (err) {
    // Log the real error server-side only
    console.error('[send-email] SMTP send failed:', summarizeSmtpError(err));
    return res.status(500).json({
      success: false,
      error: 'Failed to send your inquiry. Please try again or contact us directly.',
    });
  }
}
