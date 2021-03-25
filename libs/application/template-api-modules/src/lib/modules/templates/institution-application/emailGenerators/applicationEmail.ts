import { dedent } from 'ts-dedent'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'
import { getValueViaPath } from '@island.is/application/core'

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

  const institutionName = getValueViaPath(
    application.answers,
    'applicant.institution',
  )

  const subject = `Umsókn frá ${institutionName}`
  const attachments = getValueViaPath(application.answers, 'attatchments') as {
    name: string
    key: string
    url: string
  }[]

  const mailAttachments = attachments
    ? attachments.map(
        (attachment) =>
          ({
            filename: attachment?.name || '',
            href: `${attachment?.url || ''}/${attachment?.key || ''}`,
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
