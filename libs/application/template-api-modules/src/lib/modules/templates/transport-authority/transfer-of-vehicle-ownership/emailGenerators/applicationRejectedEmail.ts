import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'

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
    options: { email },
  } = props

  if (!recipient.email) throw new Error('Recipient email was undefined')

  const subject = 'Tilkynning um eigendaskipti - Búið er að afturkalla umsókn'

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
            copy: 'Búið er að afturkalla umsókn.',
          },
        },
      ],
    },
  }
}
