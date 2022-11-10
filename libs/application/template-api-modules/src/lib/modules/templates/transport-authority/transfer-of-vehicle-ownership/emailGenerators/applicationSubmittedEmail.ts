import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'

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
    options: { email },
  } = props
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!permno) throw new Error('Permno was undefined')

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
          component: 'Copy',
          context: {
            copy:
              `Góðan dag. Eigendaskipti fyrir ökutækið ${permno} hafa verið skráð. ` +
              `Allir aðilar samþykktu inn á island.is/umsoknir og búið er að greiða fyrir tilkynninguna. `,
          },
        },
      ],
    },
  }
}
