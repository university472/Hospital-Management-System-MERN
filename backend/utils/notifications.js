/**
 * notifications.js
 * Centralised email (Nodemailer) and SMS (Twilio) helper.
 *
 * ── Dependencies to install ──────────────────────────────────────────────────
 *   npm install nodemailer twilio
 *
 * ── Required .env variables ──────────────────────────────────────────────────
 *   # Email (Gmail example — works for Pakistan / anywhere)
 *   EMAIL_HOST=smtp.gmail.com
 *   EMAIL_PORT=587
 *   EMAIL_SECURE=false          # true only for port 465
 *   EMAIL_USER=your@gmail.com
 *   EMAIL_PASS=your-app-password   # Gmail App Password (not your login password)
 *   EMAIL_FROM="Hospital Management System <your@gmail.com>"
 *
 *   # Twilio SMS (works in Pakistan with any mobile number)
 *   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_FROM_NUMBER=+1XXXXXXXXXX   # Your Twilio number
 *
 * ── How to get Gmail App Password ────────────────────────────────────────────
 *   1. Go to https://myaccount.google.com/security
 *   2. Enable 2-Step Verification
 *   3. Search "App passwords" → create one for "Mail"
 *   4. Use the 16-char code as EMAIL_PASS
 *
 * ── How to get Twilio credentials ────────────────────────────────────────────
 *   1. Sign up at https://www.twilio.com
 *   2. Dashboard → Account SID and Auth Token shown at top
 *   3. Phone Numbers → Buy a number (or use trial number)
 *   4. For Pakistan: Twilio supports sending SMS to +92 numbers via their
 *      international routes. Trial accounts can only send to verified numbers.
 *      For production, upgrade and use a Messaging Service or Alpha Sender ID.
 *
 * ── Pakistan SMS Alternatives ────────────────────────────────────────────────
 *   If you want a local Pakistani provider instead of Twilio:
 *   - Jazz/Warid Business SMS API: https://developer.jazzcash.com.pk
 *   - Zong SMS Gateway: https://www.zong.com.pk/sms-gateway
 *   - EasySMS Pakistan: https://www.easysms.com.pk
 *   - MTIT (local aggregator): https://www.mtit.com.pk
 *   All follow the same pattern: HTTP POST with API key + number + message.
 *   Replace sendSMS() below with the chosen provider's API call.
 */

const nodemailer = require('nodemailer')

// ── Lazy-load Twilio so the app doesn't crash if credentials are missing ──────
let twilioClient = null
function getTwilio() {
  if (!twilioClient) {
    const sid = process.env.TWILIO_ACCOUNT_SID
    const token = process.env.TWILIO_AUTH_TOKEN
    if (!sid || !token) {
      console.warn('⚠️  Twilio credentials not set — SMS disabled')
      return null
    }
    twilioClient = require('twilio')(sid, token)
  }
  return twilioClient
}

// ── Nodemailer transporter (created once, reused) ─────────────────────────────
let transporter = null
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }
  return transporter
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send doctor welcome email after admin adds them.
 * Includes login credentials and schedule summary.
 */
async function sendDoctorWelcomeEmail({ doctor, plainPassword }) {
  if (!process.env.EMAIL_USER) {
    console.warn('⚠️  EMAIL_USER not set — skipping welcome email')
    return
  }

  const startFormatted = doctor.workingHours?.start || '10:00'
  const endFormatted = doctor.workingHours?.end || '17:00'
  const maxPatients = doctor.maxPatientsPerDay || 'N/A'
  const minutesPerPatient = doctor.minutesPerPatient || 30

  const followUpInfo = doctor.followUpFree
    ? 'Follow-up visits are <strong>FREE</strong> for your patients.'
    : doctor.followUpDiscountPercent > 0
      ? `Follow-up visits receive a <strong>${doctor.followUpDiscountPercent}% discount</strong> within ${doctor.followUpWindowDays} days.`
      : 'No follow-up discount configured.'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f7ff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: #2563eb; color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
    .body { padding: 30px; }
    .greeting { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
    .section { background: #f8faff; border-left: 4px solid #2563eb; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
    .section h3 { margin: 0 0 10px; color: #2563eb; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .credential { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .credential:last-child { border-bottom: none; }
    .credential .label { color: #64748b; }
    .credential .value { font-weight: bold; color: #1e293b; }
    .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #92400e; margin: 20px 0; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
    .login-btn { display: inline-block; background: #2563eb; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 Hospital Management System</h1>
      <p>Welcome to the team, Doctor</p>
    </div>
    <div class="body">
      <p class="greeting">Dear Dr. ${doctor.firstName} ${doctor.lastName},</p>
      <p style="color:#475569; line-height:1.6;">
        Your account has been created by the hospital administrator. 
        Below are your login credentials and schedule information.
        Please log in and change your password at the earliest convenience.
      </p>

      <div class="section">
        <h3>🔐 Your Login Credentials</h3>
        <div class="credential">
          <span class="label">Portal URL</span>
          <span class="value">${process.env.FRONTEND_URL || 'http://localhost:3000'}/login</span>
        </div>
        <div class="credential">
          <span class="label">Email</span>
          <span class="value">${doctor.email}</span>
        </div>
        <div class="credential">
          <span class="label">Password</span>
          <span class="value">${plainPassword}</span>
        </div>
        <div class="credential">
          <span class="label">Role</span>
          <span class="value">Doctor</span>
        </div>
      </div>

      <div class="warning">
        ⚠️ <strong>Important:</strong> This email contains your temporary password. 
        Please log in and update your password immediately. Do not share this email.
      </div>

      <div class="section">
        <h3>📋 Your Profile</h3>
        <div class="credential">
          <span class="label">Specialty</span>
          <span class="value">${doctor.specialty}</span>
        </div>
        <div class="credential">
          <span class="label">License Number</span>
          <span class="value">${doctor.licenseNumber}</span>
        </div>
        <div class="credential">
          <span class="label">Phone</span>
          <span class="value">${doctor.phoneNumber}</span>
        </div>
      </div>

      <div class="section">
        <h3>🕐 Your Schedule</h3>
        <div class="credential">
          <span class="label">Working Hours</span>
          <span class="value">${startFormatted} – ${endFormatted}</span>
        </div>
        <div class="credential">
          <span class="label">Minutes per Patient</span>
          <span class="value">${minutesPerPatient} minutes</span>
        </div>
        <div class="credential">
          <span class="label">Max Patients / Day</span>
          <span class="value">${maxPatients} patients</span>
        </div>
        <div class="credential">
          <span class="label">Follow-up Policy</span>
          <span class="value">${doctor.followUpFree ? 'Free' : doctor.followUpDiscountPercent > 0 ? doctor.followUpDiscountPercent + '% discount' : 'None'}</span>
        </div>
      </div>

      <p style="color:#475569; font-size:14px; line-height:1.6;">${followUpInfo}</p>

      <div style="text-align:center; margin: 25px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="login-btn">
          Login to Your Dashboard →
        </a>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated message from Hospital Management System.</p>
      <p>If you received this in error, please contact hospital administration.</p>
    </div>
  </div>
</body>
</html>`

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || `"HMS" <${process.env.EMAIL_USER}>`,
    to: doctor.email,
    subject: '🏥 Welcome to HMS — Your Doctor Account & Schedule',
    html
  })

  console.log(`✅ Welcome email sent to ${doctor.email}`)
}

// ─────────────────────────────────────────────────────────────────────────────
// SMS FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send appointment confirmation SMS to patient after booking.
 * @param {string} to - Phone number in E.164 format, e.g. +923001234567
 * @param {object} info - { tokenCode, queueNumber, estimatedTime, doctorName, date, visitType, isFree, discountApplied }
 */
async function sendAppointmentSMS(to, info) {
  const client = getTwilio()
  if (!client) return // SMS disabled — silently skip

  // Normalise Pakistani number: 03XXXXXXXXX → +923XXXXXXXXX
  let phone = to.toString().trim()
  if (phone.startsWith('0')) phone = '+92' + phone.slice(1)
  if (!phone.startsWith('+')) phone = '+' + phone

  const date = new Date(info.date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  let discountLine = ''
  if (info.isFree) discountLine = '\n✅ FREE Follow-up Visit'
  else if (info.discountApplied > 0)
    discountLine = `\n💰 ${info.discountApplied}% Follow-up Discount`

  const message =
    `🏥 HMS Appointment Confirmed!\n` +
    `Token: ${info.tokenCode}\n` +
    `Queue: #${info.queueNumber}\n` +
    `Est. Time: ${info.estimatedTime}\n` +
    `Date: ${date}\n` +
    `Doctor: Dr. ${info.doctorName}` +
    discountLine +
    `\nPlease arrive 5 mins before your time.\n` +
    `Show Token ${info.tokenCode} at reception.`

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_FROM_NUMBER,
      to: phone
    })
    console.log(`✅ SMS sent to ${phone}`)
  } catch (err) {
    // Log but never crash the booking flow due to SMS failure
    console.error(`⚠️  SMS failed to ${phone}:`, err.message)
  }
}

module.exports = {
  sendDoctorWelcomeEmail,
  sendAppointmentSMS
}
