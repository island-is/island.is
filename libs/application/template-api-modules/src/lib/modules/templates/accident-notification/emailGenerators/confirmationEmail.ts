import { dedent } from 'ts-dedent'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { overviewTemplate } from './overviewTemplate'
import { SendMailOptions } from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'
import { AccidentNotificationAnswers } from '@island.is/application/templates/accident-notification'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    attachments: Attachment[],
  ): SendMailOptions
}

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  applicationSenderName,
  applicationSenderEmail,
  attachments,
) => {
  const {
    application,
    options: { locale },
  } = props

  const answers = application.answers as AccidentNotificationAnswers
  const applicant = {
    name: answers.applicant.name,
    address: answers.applicant.email,
  }

  const subject = `Tilkynning um slys hefur verið móttekin.`
  const overview = overviewTemplate(application)

  // TODO: Translations?
  const body = dedent(`
    <h2>Tilkynning móttekin</h2>
    <p>
      Takk fyrir að tilkynna slys. Sjúkratryggingar Íslands verður í sambandi við þig ef frekari upplýsingar vantar.
      Ef þú vilt hafa samband getur þú sent tölvupóst á netfangið <a href="mailto:info@sjukra.is">info@sjukra.is</a>
    </p>
    <p>
      Þú getur fylgst með stöðu mála á
      <a href="https://island.is/umsoknir/tilkynning-um-slys">https://island.is/umsoknir/tilkynning-um-slys</a>
    </p> </br>
    ${overview}
`)

  return {
    from: {
      name: applicationSenderName,
      address: applicationSenderEmail,
    },
    to: applicant,
    cc: undefined,
    attachments,
    subject,
    html: body,
  }
}
