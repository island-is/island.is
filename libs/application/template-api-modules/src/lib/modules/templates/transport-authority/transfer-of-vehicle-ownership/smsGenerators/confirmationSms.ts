import { SmsMessage } from '../../../../../types'

export type ConfirmationSms = (
  recipientName: string,
  recipientPhone: string,
) => SmsMessage

export const generateConfirmationSms: ConfirmationSms = (
  recipientName,
  recipientPhone,
) => {
  const subject = 'Tilkynning um eigendaskipti - Búið er að klára umsókn'
  const bodyText = 'Umsóknin er komin til okkar.'
  return {
    phoneNumber: recipientPhone,
    message: subject + '\n' + bodyText,
  }
}
