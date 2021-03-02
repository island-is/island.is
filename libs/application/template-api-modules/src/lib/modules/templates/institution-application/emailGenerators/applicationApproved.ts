import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'
import { messages } from '@island.is/application/templates/institution-application'
import mapValues from 'lodash/mapValues'


export interface nodemailAttachment {
  filename: string
  href: string
}

export const generateApplicationEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { locale },
  } = props

  const institutionApplicant = get(application.answers, 'applicant.institution')
  const applicantEmail = get(application.answers, 'contact.email')
  const applicantName = get(application.answers, 'contact.name')
  const applicantPhone = get(application.answers, 'contact.phoneNumber')

  const projectName = get(application.answers, 'project.name')
  const projectGoal = get(application.answers, 'project.goals')
  const projectScope = get(application.answers, 'project.scope')
  const projectFinance = get(application.answers, 'project.finance')
  const projectBackground = get(application.answers, 'project.background')

  const hasTime = get(application.answers, 'constraints.hasTime') as boolean
  const hasMoral = get(application.answers, 'constraints.hasMoral') as boolean
  const hasOther = get(application.answers, 'constraints.hasOther') as boolean
  const hasShopping = get(application.answers, 'constraints.hasShopping') as boolean
  const hasFinancial = get(application.answers, 'constraints.hasFinancial') as boolean
  const hasTechnical = get(application.answers, 'constraints.hasTechnical') as boolean

  const noConstraints = [hasTime, hasMoral, hasOther, hasShopping, hasFinancial, hasTechnical].every((x) => !x)

  console.log(application.answers)
  const subject = `Umsókn frá ${institutionApplicant}`
  const attachments = get(application.answers, 'attatchments') as []
  const mailAttachments = attachments.map(
    (attachment) => <nodemailAttachment>{
      filename: get(attachment, 'name'),
      href: `${get(attachment, 'url')}/${get(attachment, 'key')}`
    })

  const secondaryContact = ``

  const body =
    dedent(`
        Umsókn hefur send verið inn frá ${institutionApplicant}.

        # Nafn  ${applicantName}
        # Tölvupóstfang ${applicantEmail}
        # Sími  ${applicantPhone}

        Verkefni

        ${messages.projectName.defaultMessage}:
        ${projectName}

        ${messages.projectBackground.defaultMessage}:
        ${projectBackground}

        ${messages.projectGoals.defaultMessage}:
        ${projectGoal}

        ${messages.projectFinance.defaultMessage}:
        ${projectFinance}

        ${messages.projectScope.defaultMessage}:
        ${projectScope}


        ${noConstraints ? 'Engar skorður skilgreindar.' : 'Skorður:'}

        ${hasTechnical ?
        `Tæknilegar skorður
          ${get(application.answers, 'constraints.technical')}` : ''}
        ${hasFinancial ?
        `Fjárhagslegar skorður
          ${get(application.answers, 'constraints.financial')}` : ''}
        ${hasTime ?
        `Tímaskorður
          ${get(application.answers, 'constraints.time')}` : ''}
        ${hasShopping ?
        `Innkaupa skorður
          ${get(application.answers, 'constraints.shopping')}` : ''}
        ${hasMoral ?
        `Siðferðilegar skorður
          ${get(application.answers, 'constraints.moral')}` : ''}
        ${hasOther ?
        `Aðrar skorður
          ${get(application.answers, 'constraints.other')}` : ''}


      `)

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: applicantEmail as string,
      },
    ],
    attachments: mailAttachments,
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
