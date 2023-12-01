import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { TransferOfMachineOwnershipAnswers } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'

export type ApplicationSubmittedSms = (
  application: Application,
  recipient: EmailRecipient,
) => SmsMessage

export const generateApplicationSubmittedSms: ApplicationSubmittedSms = (
  application,
  recipient,
) => {
  const answers = application.answers as TransferOfMachineOwnershipAnswers
  const regNumber = answers?.machine.regNumber

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!regNumber) throw new Error('Permno was undefined')

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Eigendaskipti fyrir tækið ${regNumber} hafa verið skráð. ` +
      `Allir aðilar samþykktu inn á island.is/umsoknir og búið er að greiða fyrir tilkynninguna. `,
  }
}
