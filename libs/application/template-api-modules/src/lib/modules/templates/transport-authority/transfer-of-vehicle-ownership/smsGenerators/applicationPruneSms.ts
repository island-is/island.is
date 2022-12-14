import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import {
  getRoleNameById,
  getAllRoles,
  getRecipients,
} from '../transfer-of-vehicle-ownership.utils'

export type ApplicationPruneSms = (
  application: Application,
  recipient: EmailRecipient,
) => SmsMessage

export const generateApplicationPruneSms: ApplicationPruneSms = (
  application,
  recipient,
) => {
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate
  const notApprovedByList = getRecipients(answers, getAllRoles()).filter(
    (x) => x.approved !== true,
  )

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const notApprovedByListStr = notApprovedByList
    .map(
      (notApprovedBy) =>
        `${notApprovedBy.name}, kt. ${notApprovedBy.ssn} (${getRoleNameById(
          notApprovedBy.role,
        )}). `,
    )
    .join(',')

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Beiðni um eigendaskipti á ökutækinu ${permno} hefur verið afturkölluð þar sem eftirfarandi aðilar staðfestu ekki: ` +
      `${notApprovedByListStr}. ` +
      `Nánari upplýsingar á island.is/umsoknir.`,
  }
}
