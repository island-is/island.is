import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'

export type ApplicationDeleteSms = (recipient: EmailRecipient) => SmsMessage

export const generateApplicationDeleteSms: ApplicationDeleteSms = (
  recipient,
) => {
  if (!recipient.phone) throw new Error('Recipient phone was undefined')

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Beiðni um samþykkt á starfstíma á vinnuvél hefur verið afturkölluð þar sem umsækjandi eyddi umsókninni.` +
      `Nánari upplýsingar á island.is/umsoknir. `,
  }
}
