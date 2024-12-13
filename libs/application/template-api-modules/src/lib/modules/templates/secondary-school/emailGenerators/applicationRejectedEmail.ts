import { SecondarySchoolAnswers } from '@island.is/application/templates/secondary-school'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { EmailRecipient } from '../types'
import { pathToAsset } from '../utils'
import { ApplicationConfigurations } from '@island.is/application/types'

export type ApplicationRejectedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateApplicationRejectedEmail: ApplicationRejectedEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props
  const answers = application.answers as SecondarySchoolAnswers

  if (!recipient.email) throw new Error('Recipient email was undefined')

  const applicantName = answers.applicant.name
  const applicantNationalId = answers.applicant.nationalId

  const subject = 'Umsókn um framhaldsskóla - Umsókn eydd'

  const message =
    `<span>Umsókn nemandans</span><br/>` +
    `<span>${applicantName}, kt. ${applicantNationalId}</span><br/>` +
    `<span>um nám í framhaldsskóla hefur verið eytt.</span><br/>` +
    `<span>Þú getur farið inn á mínar síður og skoðað sögu umsóknarinnar.</span>`

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [{ name: recipient.name, address: recipient.email }],
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Image',
          context: {
            src: pathToAsset('logo.jpg'),
            alt: 'Ísland.is logo',
          },
        },
        {
          component: 'Image',
          context: {
            src: pathToAsset('computerIllustration.jpg'),
            alt: 'Kaffi við skjá myndskreyting',
          },
        },
        {
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Copy',
          context: {
            copy: message,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.SecondarySchool.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}
