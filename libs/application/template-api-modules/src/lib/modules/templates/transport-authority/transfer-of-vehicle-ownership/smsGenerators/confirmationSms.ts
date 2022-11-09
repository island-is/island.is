import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'

export type ConfirmationSms = (recipient: EmailRecipient) => SmsMessage

export const generateConfirmationSms: ConfirmationSms = (recipient) => {
  if (!recipient.phone) throw new Error('Recipient phone was undefined')

  const subject = 'Tilkynning um eigendaskipti - Búið er að klára umsókn'
  const bodyText = 'Umsóknin er komin til okkar.'
  return {
    phoneNumber: recipient.phone || '',
    message: subject + '\n' + bodyText,
  }
}
