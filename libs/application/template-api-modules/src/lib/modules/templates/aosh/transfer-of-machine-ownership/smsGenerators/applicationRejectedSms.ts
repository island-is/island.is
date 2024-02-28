import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { getRoleNameById } from '../transfer-of-machine-ownership.utils'
import { TransferOfMachineOwnershipAnswers } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'

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
  const answers = application.answers as TransferOfMachineOwnershipAnswers
  const regNumber = answers?.machine?.regNumber

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!regNumber) throw new Error('Registration number  was undefined')
  if (!rejectedBy?.ssn) throw new Error('Rejected by ssn was undefined')

  const rejectedByStr = `${rejectedBy.name}, kt. ${
    rejectedBy.ssn
  } (${getRoleNameById(rejectedBy.role)})`

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Beiðni um eigendaskipti á tækinu ${regNumber} hefur verið afturkölluð þar sem eftirfarandi aðilar staðfestu ekki: ` +
      `${rejectedByStr}. ` +
      `Nánari upplýsingar á island.is/umsoknir. `,
  }
}
