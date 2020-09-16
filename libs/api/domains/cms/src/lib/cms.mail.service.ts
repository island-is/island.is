import { Injectable } from '@nestjs/common'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

@Injectable()
export class MailService {
  async deliverContactUs({
    name,
    phone,
    email,
    subject,
    message,
  }: {
    name: string
    phone: string
    email: string
    subject: string
    message: string
  }): Promise<boolean> {
    try {
      await sgMail.send({
        to: process.env.CONTACT_US_TO || 'island@island.is',
        from: process.env.CONTACT_US_FROM || 'islandisservice@gmail.com',
        subject: subject || 'Skilaboð frá „Hafðu samband“ á island.is',
        text: `
Skilaboð frá „Hafðu samband“ á island.is

Nafn: ${name}
Sími: ${phone}
email: ${email}
skilaboð:

${message}
`,
      })
      return true
    } catch (error) {
      console.error(error)

      if (error.response) {
        console.error(error.response.body)
      }
    }

    return false
  }
}
