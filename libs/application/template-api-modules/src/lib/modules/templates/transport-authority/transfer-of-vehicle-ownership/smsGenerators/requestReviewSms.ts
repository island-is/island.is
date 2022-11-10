import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { getApplicationPruneDateStr } from '../transfer-of-vehicle-ownership.utils'

export type RequestReviewSms = (
  application: Application,
  recipient: EmailRecipient,
) => SmsMessage

export const generateRequestReviewSms: RequestReviewSms = (
  application,
  recipient,
) => {
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const pruneDateStr = getApplicationPruneDateStr(application.created)

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Þín bíður ósamþykkt beiðni um eigendaskipti fyrir ökutækið ${permno} inn á island.is/umsóknir. ` +
      `Til þess að eigendaskiptin verði skráð þarftu að samþykkja beiðnina fyrir ${pruneDateStr}.`,
  }
}
