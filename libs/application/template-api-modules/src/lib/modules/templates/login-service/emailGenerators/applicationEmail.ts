import { dedent } from 'ts-dedent'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'
import { getValueViaPath } from '@island.is/application/core'

interface ApplicationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    applicationRecipientName: string,
    applicationRecipientEmail: string,
  ): SendMailOptions
}

export const generateApplicationEmail: ApplicationEmail = (
  props,
  applicationSenderName,
  applicationSenderEmail,
  applicationRecipientName,
  applicationRecipientEmail,
): SendMailOptions => {
  const { application } = props
  const name = getValueViaPath(application.answers, 'applicant.name')

  const subject = `Umsókn um innskráningarþjónustu fyrir ${name}`

  const overview = applicationOverviewTemplate(application)
  const body = dedent(`<h2>Yfirlit umsóknar</h2> ${overview}`)

  return {
    from: {
      name: applicationSenderName,
      address: applicationSenderEmail,
    },
    to: [
      {
        name: applicationRecipientName,
        address: applicationRecipientEmail,
      },
    ],
    subject,
    html: body,
  }
}
