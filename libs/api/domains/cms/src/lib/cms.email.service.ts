import { Injectable } from '@nestjs/common'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

@Injectable()
export class EmailService {
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
        to: 'magnus@kosmosogkaos.is',
        from: 'magnus@kosmosogkaos.is',
        subject,
        text: `
Nafn: ${name}
Sími: ${phone}
email: ${email}
skilaboð:

${message}`,
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
