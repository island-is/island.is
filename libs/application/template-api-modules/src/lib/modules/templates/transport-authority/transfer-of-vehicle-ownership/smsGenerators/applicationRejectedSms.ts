import { SmsMessage } from '../../../../../types'
import { EmailRecipient, RejectType } from '../types'
import { Application } from '@island.is/application/types'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { getRoleNameById } from '../transfer-of-vehicle-ownership.utils'

export type ApplicationRejectedSms = (
  application: Application,
  recipient: EmailRecipient,
  rejectedBy: EmailRecipient | undefined,
  rejectType: RejectType,
) => SmsMessage

export const generateApplicationRejectedSms: ApplicationRejectedSms = (
  application,
  recipient,
  rejectedBy,
  rejectType,
) => {
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.pickVehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')
  if (!rejectedBy?.ssn) throw new Error('Rejected by ssn was undefined')

  const rejectedByStr = `${rejectedBy.name}, kt. ${
    rejectedBy.ssn
  } (${getRoleNameById(rejectedBy.role)})`

  let message = `Beiðni um eigendaskipti á ökutækinu ${permno} hefur verið afturkölluð, `
  if (rejectType === RejectType.REJECT) {
    message += `þar sem eftirfarandi aðilar staðfestu ekki: `
  } else if (rejectType === RejectType.DELETE) {
    message += `þar sem eftirfarandi aðilar hættu við:`
  }
  message += `${rejectedByStr}. Nánari upplýsingar á island.is/umsoknir. `

  return {
    phoneNumber: recipient.phone || '',
    message: message,
  }
}
