import { dedent } from 'ts-dedent'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'
import { getValueViaPath } from '@island.is/application/core'
import { InstitutionAttachment } from '../types'

export interface NodemailAttachment {
  filename: string
  href: string
}

interface ApplicationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSender: string,
    applicationRecipient: string,
    attachments: InstitutionAttachment[],
  ): SendMailOptions
}

export const generateApplicationEmail: ApplicationEmail = (
  props,
  applicationSender,
  applicationRecipient,
  attachments,
): SendMailOptions => {
  const {
    application,
    options: { locale },
  } = props
  const institutionName = getValueViaPath(
    application.answers,
    'applicant.institution',
  )

  const subject = `Umsókn frá ${institutionName}`
  const mailAttachments = attachments
    ? attachments.map(
        ({ url, name }) =>
          ({
            filename: name,
            href: url,
          } as NodemailAttachment),
      )
    : []

  const overview = applicationOverviewTemplate(application)
  const body = dedent(`<h2>Yfirlit umsóknar</h2> ${overview}`)

  return {
    from: {
      name: 'Stafrænt Ísland',
      address: applicationSender,
    },
    to: [
      {
        name: '',
        address: applicationRecipient,
      },
    ],
    attachments: mailAttachments,
    subject,
    html: body,
  }
}
