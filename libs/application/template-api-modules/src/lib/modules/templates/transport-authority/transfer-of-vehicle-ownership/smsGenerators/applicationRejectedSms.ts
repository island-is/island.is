import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { getRoleNameById } from '../transfer-of-vehicle-ownership.utils'

export type ApplicationRejectedSms = (
  application: Application,
  recipient: EmailRecipient,
  rejectedBy: EmailRecipient | undefined,
) => SmsMessage

export const generateApplicationRejectedSms: ApplicationRejectedSms = (
  application,
  recipient,
  rejectedBy,
) => {
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')
  if (!rejectedBy?.ssn) throw new Error('Rejected by ssn was undefined')

  const rejectedByStr = `${rejectedBy.name}, kt. ${
    rejectedBy.ssn
  } (${getRoleNameById(rejectedBy.role)})`

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Beiðni um eigendaskipti á ökutækinu ${permno} hefur verið afturkölluð þar sem eftirfarandi aðilar staðfestu ekki: ` +
      `${rejectedByStr}. ` +
      `Nánari upplýsingar á island.is/umsoknir. `,
  }
}
