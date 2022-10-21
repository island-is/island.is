import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'

export type ConfirmationEmail = (
  props: EmailTemplateGeneratorProps,
  recipientName: string,
  recipientEmail: string,
) => Message

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  recipientName,
  recipientEmail,
): Message => {
  const {
    application,
    options: { email },
  } = props

  if (!recipientEmail) throw new Error('Recipient email was undefined')

  const subject = 'Tilkynning um eigendaskipti - Búið er að klára umsókn'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [{ name: recipientName, address: recipientEmail }],
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Copy',
          context: {
            copy: 'Umsóknin er komin til okkar.',
          },
        },
      ],
    },
  }
}
