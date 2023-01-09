import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { ChangeOperatorOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'

export type ApplicationSubmittedSms = (
  application: Application,
  recipient: EmailRecipient,
) => SmsMessage

export const generateApplicationSubmittedSms: ApplicationSubmittedSms = (
  application,
  recipient,
) => {
  const answers = application.answers as ChangeOperatorOfVehicleAnswers
  const permno = answers?.pickVehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Breyting á umráðamönnum fyrir ökutækið ${permno} hafa verið skráð. ` +
      `Allir aðilar samþykktu inn á island.is/umsoknir og búið er að greiða fyrir tilkynninguna. `,
  }
}
