import { SmsMessage } from '../../../../../types'

export type AssignReviewerSms = (
  recipientName: string,
  recipientPhone: string,
) => SmsMessage

export const generateAssignReviewerSms: AssignReviewerSms = (
  recipientName,
  recipientPhone,
) => {
  const subject = 'Tilkynning um eigendaskipti - Vantar samþykki'
  const bodyText =
    'Tilkynning um eigendaskipti hefur borist Samgöngustofu þar sem þú þarft að samþykkja.'
  return {
    phoneNumber: recipientPhone,
    message: subject + '\n' + bodyText,
  }
}
