import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'

export type NotifyPostPruneSms = (
  application: Application,
  recipient: EmailRecipient,
) => SmsMessage

export const generateNotifyPostPruneSms: NotifyPostPruneSms = (
  application,
  recipient,
) => {
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')

  return {
    phoneNumber: recipient.phone || '',
    message: `Eigendaskipti fyrir ökutækið ${permno} hefur runnið út. `, // TODOx need text from SGS
  }
}
