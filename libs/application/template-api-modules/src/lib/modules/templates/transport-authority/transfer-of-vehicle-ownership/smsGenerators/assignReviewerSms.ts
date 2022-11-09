import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'

export type AssignReviewerSms = (recipient: EmailRecipient) => SmsMessage

export const generateAssignReviewerSms: AssignReviewerSms = (recipient) => {
  if (!recipient.phone) throw new Error('Recipient phone was undefined')

  const subject = 'Tilkynning um eigendaskipti - Vantar samþykki'
  const bodyText =
    'Tilkynning um eigendaskipti hefur borist Samgöngustofu þar sem þú þarft að samþykkja.'
  return {
    phoneNumber: recipient.phone || '',
    message: subject + '\n' + bodyText,
  }
}
