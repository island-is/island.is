import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'

export type AssignReviewerEmail = (
  props: EmailTemplateGeneratorProps,
  recipientName: string,
  recipientEmail: string,
) => Message

export const generateAssignReviewerEmail: AssignReviewerEmail = (
  props,
  recipientName,
  recipientEmail,
): Message => {
  const {
    application,
    options: { email },
  } = props

  if (!recipientEmail) throw new Error('Recipient email was undefined')

  const subject = 'Tilkynning um eigendaskipti - Vantar samþykki'

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
            copy:
              'Tilkynning um eigendaskipti hefur borist Samgöngustofu þar sem þú þarft að samþykkja.',
          },
        },
      ],
    },
  }
}
