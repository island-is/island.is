import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { ChangeCoOwnerOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'

export type ApplicationSubmittedSms = (
  application: Application,
  recipient: EmailRecipient,
) => SmsMessage

export const generateApplicationSubmittedSms: ApplicationSubmittedSms = (
  application,
  recipient,
) => {
  const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
  const permno = answers?.pickVehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Breyting á meðeigendum fyrir ökutækið ${permno} hafa verið skráð. ` +
      `Allir aðilar samþykktu inn á island.is/umsoknir og búið er að greiða fyrir tilkynninguna. `,
  }
}
