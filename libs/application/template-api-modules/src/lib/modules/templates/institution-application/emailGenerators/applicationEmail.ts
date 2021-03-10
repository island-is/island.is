import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'

export interface NodemailAttachment {
  filename: string
  href: string
}

interface ApplicationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSender: string,
    applicationRecipient: string,
  ): SendMailOptions
}

export const generateApplicationEmail: ApplicationEmail = (
  props,
  applicationSender,
  applicationRecipient,
): SendMailOptions => {
  const {
    application,
    options: { locale },
  } = props

  const institutionName = get(application.answers, 'applicant.institution')

  const subject = `Umsókn frá ${institutionName}`
  const attachments = get(application.answers, 'attatchments') as []

  const mailAttachments = attachments
    ? attachments.map(
        (attachment) =>
          ({
            filename: get(attachment, 'name'),
            href: `${get(attachment, 'url')}/${get(attachment, 'key')}`,
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
