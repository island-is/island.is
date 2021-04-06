import { dedent } from 'ts-dedent'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'
import { getValueViaPath } from '@island.is/application/core'
import { InstitutionAttachment, NodemailAttachment } from '../types'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    senderEmailAddress: string,
    attachments: InstitutionAttachment[],
  ): SendMailOptions
}

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  senderEmailAddress,
  attachments,
) => {
  const {
    application,
    options: { locale },
  } = props

  const institutionName = getValueViaPath(
    application.answers,
    'applicant.institution',
  )

  const contactEmail = getValueViaPath(application.answers, 'contact.email')

  const secondaryContactEmail =
    getValueViaPath(application.answers, 'secondaryContact.email') || ''

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
  const mailAttachments = attachments
    ? attachments.map(
        ({ url, name }) =>
          ({
            filename: name,
            href: url,
          } as NodemailAttachment),
      )
    : []

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
    attachments: mailAttachments,
    subject,
    html: body,
  }
}
