import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { EmailRecipient } from '../types'
import { pathToAsset } from '../utils'
import { ApplicationConfigurations } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

export type ApplicationDeletedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateApplicationDeletedEmail: ApplicationDeletedEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props
  if (!recipient.email) throw new Error('Recipient email was undefined')

  const applicantNationalId = getValueViaPath<string>(
    application.answers,
    'applicant.nationalId',
  )
  const applicantName = getValueViaPath<string>(
    application.answers,
    'applicant.name',
  )

  const subject = 'Umsókn um framhaldsskóla eytt!'

  const message =
    `<span>Umsókn nemandans:</span><br/>` +
    `<span>${applicantName}, kt. ${applicantNationalId},</span><br/>` +
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
