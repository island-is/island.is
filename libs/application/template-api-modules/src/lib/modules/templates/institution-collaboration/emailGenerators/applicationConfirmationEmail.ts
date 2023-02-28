import { dedent } from 'ts-dedent'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'
import { getValueViaPath } from '@island.is/application/core'
import { InstitutionAttachment, NodemailAttachment } from '../types'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    attachments: InstitutionAttachment[],
  ): SendMailOptions
}

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  applicationSenderName,
  applicationSenderEmail,
  attachments,
) => {
  const { application } = props

  const institutionName = getValueViaPath(
    application.answers,
    'applicant.institution.label',
  )

  const contactEmail = getValueViaPath(application.answers, 'contact.email')
  const contactName = getValueViaPath(application.answers, 'contact.name')

  const secondaryContactEmail =
    getValueViaPath(application.answers, 'secondaryContact.email') || ''

  const secondaryContactName =
    getValueViaPath(application.answers, 'secondaryContact.name') || ''

  const subject = `Umsókn þín fyrir ${institutionName} hefur verið móttekin.`
  const overview = applicationOverviewTemplate(application)

  const body = dedent(`
        <h2>Takk fyrir umsóknina!</h2>
        <p>
          Umsóknin er formlega móttekin. </br>
          Verkefnastjóri Stafræns Íslands verður í sambandi sem fer yfir verkefnið með ykkur og næstu skref.</br>
          Fyrir frekari upplýsingar er hægt að hafa samband á netfangið <a href="mailto:island@island.is">island@island.is</a> </br>
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
      name: applicationSenderName,
      address: applicationSenderEmail,
    },
    to: [
      {
        name: contactName as string,
        address: contactEmail as string,
      },
    ],
    cc: {
      name: secondaryContactName as string,
      address: secondaryContactEmail as string,
    },
    attachments: mailAttachments,
    subject,
    html: body,
  }
}
