import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'

export type ApplicationRejectedSms = (recipient: EmailRecipient) => SmsMessage

export const generateApplicationRejectedSms: ApplicationRejectedSms = (
  recipient,
) => {
  if (!recipient.phone) throw new Error('Recipient phone was undefined')

  const subject = 'Tilkynning um eigendaskipti - Afturkalla umsókn'
  const bodyText = 'Búið er að afturkalla umsókn.'
  return {
    phoneNumber: recipient.phone || '',
    message: subject + '\n' + bodyText,
  }
}
