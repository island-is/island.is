import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'

import { getValueViaPath } from '@island.is/application/core'
import { FundingGovernmentProjectsAnswers } from '@island.is/application/templates/funding-government-projects'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { FundingAttachment, NodemailAttachment } from '../types'

import { applicationOverviewTemplate } from './applicationOverviewTemplate'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    attachments: FundingAttachment[],
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

  const institutionName = getValueViaPath(
    application.answers,
    'organizationOrInstitutionName',
  )

  const answers = application.answers as FundingGovernmentProjectsAnswers

  const contacts = answers.contacts.map((contact) => ({
    name: contact.name,
    address: contact.email,
  }))
  const [, ...additionalContacts] = contacts

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
      name: applicationSenderName,
      address: applicationSenderEmail,
    },
    to: contacts[0],
    cc: additionalContacts || null,
    attachments: mailAttachments,
    subject,
    html: body,
  }
}
