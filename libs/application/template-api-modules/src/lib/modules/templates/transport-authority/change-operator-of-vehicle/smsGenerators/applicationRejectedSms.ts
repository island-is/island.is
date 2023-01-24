import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { ChangeOperatorOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'
import { getRoleNameById } from '../change-operator-of-vehicle.utils'

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
  const answers = application.answers as ChangeOperatorOfVehicleAnswers
  const permno = answers?.pickVehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')
  if (!rejectedBy?.ssn) throw new Error('Rejected by ssn was undefined')

  const rejectedByStr = `${rejectedBy.name}, kt. ${
    rejectedBy.ssn
  } (${getRoleNameById(rejectedBy.role)})`

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Beiðni um breytingu á umráðamönnum á ökutækinu ${permno} hefur verið afturkölluð þar sem eftirfarandi aðilar staðfestu ekki: ` +
      `${rejectedByStr}. ` +
      `Nánari upplýsingar á island.is/umsoknir. `,
  }
}
