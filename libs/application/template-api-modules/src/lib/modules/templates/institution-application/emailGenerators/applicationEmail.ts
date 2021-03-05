import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { EmailTemplateGenerator } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
export interface nodemailAttachment {
  filename: string
  href: string
}

export const generateApplicationEmail: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { locale },
  } = props
  const recpient =
    process.env.INSTITUTION_APPLICATION_RECIPIENT || 'olafur@sendiradid.is'

  const institutionName = get(application.answers, 'applicant.institution')

  const subject = `Umsókn frá ${institutionName}`
  const attachments = get(application.answers, 'attatchments') as []

  const mailAttachments = attachments
    ? attachments.map(
        (attachment) =>
          <nodemailAttachment>{
            filename: get(attachment, 'name'),
            href: `${get(attachment, 'url')}/${get(attachment, 'key')}`,
          },
      )
    : []

  const overview = applicationOverviewTemplate(application)
  const body = dedent(`<h2>Yfirlit umsóknar</h2> ${overview}`)

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: recpient,
      },
    ],
    attachments: mailAttachments,
    subject,
    html: body,
  }
}
