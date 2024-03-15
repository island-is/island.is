import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { ChangeMachineSupervisorAnswers } from '@island.is/application/templates/aosh/change-machine-supervisor'

export type ApplicationSubmittedSms = (
  application: Application,
  recipient: EmailRecipient,
  supervisorName: string,
) => SmsMessage

export const generateApplicationSubmittedSms: ApplicationSubmittedSms = (
  application,
  recipient,
  supervisorName,
) => {
  const answers = application.answers as ChangeMachineSupervisorAnswers
  const regNumber = answers?.machine.regNumber

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!regNumber) throw new Error('Registration number was undefined')

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Umráðaskipti fyrir tækið ${regNumber} hafa verið skráð. ` +
      `${supervisorName} er nú skráður sem nýr umráðamaður.`,
  }
}
