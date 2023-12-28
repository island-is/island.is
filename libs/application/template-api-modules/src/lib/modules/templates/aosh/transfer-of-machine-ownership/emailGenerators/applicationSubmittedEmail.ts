import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import { pathToAsset } from '../transfer-of-machine-ownership.utils'
import { ApplicationConfigurations } from '@island.is/application/types'
import { TransferOfMachineOwnershipAnswers } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'

export type ApplicationSubmittedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateApplicationSubmittedEmail: ApplicationSubmittedEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props
  const answers = application.answers as TransferOfMachineOwnershipAnswers
  const regNumber = answers?.machine.regNumber

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!regNumber) throw new Error('Registration number was undefined')

  const subject = 'Tilkynning um eigendaskipti - Búið er að skrá beiðni'

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
            copy:
              `<span>Góðan dag,</span><br/><br/>` +
              `<span>Eigendaskipti fyrir tækið ${regNumber} hafa verið skráð.</span><br/>` +
              `<span>Allir aðilar samþykktu inn á island.is/umsoknir og búið er að greiða fyrir tilkynninguna.</span>`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.TransferOfMachineOwnership.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}
