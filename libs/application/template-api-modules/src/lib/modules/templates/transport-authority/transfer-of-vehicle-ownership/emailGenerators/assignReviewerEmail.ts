import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'

export type AssignReviewerEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateAssignReviewerEmail: AssignReviewerEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email },
  } = props

  if (!recipient.email) throw new Error('Recipient email was undefined')

  const subject = 'Tilkynning um eigendaskipti - Vantar samþykki'

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
              'Tilkynning um eigendaskipti hefur borist Samgöngustofu þar sem þú þarft að samþykkja.',
          },
        },
      ],
    },
  }
}
