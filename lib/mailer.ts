import nodemailer from 'nodemailer'

export interface EmailPayload {
  to: string
  subject: string
  text: string
  html: string
}

export async function sendMarketplaceEmail(payload: EmailPayload): Promise<{ messageId: string }> {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || 'Lydia Market Trade Desk <orders@lydiamarket.co.ke>'

  const transporter =
    host && user && pass
      ? nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        })
      : nodemailer.createTransport({
          jsonTransport: true,
        })

  const info = await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  })

  return { messageId: info.messageId || `lm-${Date.now()}` }
}
