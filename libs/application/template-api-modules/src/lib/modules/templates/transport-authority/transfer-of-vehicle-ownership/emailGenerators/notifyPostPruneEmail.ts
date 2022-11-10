import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'

export type NotifyPostPruneEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateNotifyPostPruneEmail: NotifyPostPruneEmail = (
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

  const subject = 'Tilkynning um eigendaskipti - Umsókn hefur runnið út'

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
              `<p>Góðan dag,</p><br/>` +
              `<p>Eigendaskipti fyrir ökutækið ${permno} hefur runnið út.</p>`, // TODOx need text from SGS
          },
        },
      ],
    },
  }
}
