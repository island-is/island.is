import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'
interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    senderEmailAddress: string,
  ): SendMailOptions
}

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  senderEmailAddress,
) => {
  const {
    application,
    options: { locale },
  } = props

  const institutionName = get(application.answers, 'applicant.institution')

  const contactEmail = get(application.answers, 'contact.email')

  const secondaryContactEmail =
    get(application.answers, 'secondaryContact.email') || ''

  const subject = `Umsókn þín fyrir ${institutionName} hefur verið móttekin.`
  const overview = applicationOverviewTemplate(application)

  const body = dedent(`
        <h2>Umsókn móttekin</h2>
        <p>
          Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar. </br>
          Við verðum í sambandi ef okkur vantar frekari upplýsingar. </br>
          Ef þú þarft frekari upplýsingar þá getur þú sent okkur tölvupóst á netfangið <a href="mailto:island@island.is">island@island.is</a> </br>
        </p>
        <h2>Yfirlit umsóknar</h2>
        ${overview}
      `)

  return {
    from: {
      name: '',
      address: senderEmailAddress,
    },
    to: [
      {
        name: '',
        address: contactEmail as string,
      },
    ],
    cc: {
      name: '',
      address: secondaryContactEmail as string,
    },
    subject,
    html: body,
  }
}
