import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { ApplicationConfigurations } from '@island.is/application/types'
import { TransferOfMachineOwnerShipAnswers } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'
import { getApplicationPruneDateStr } from '../transfer-of-machine-ownership.utils'

export type RequestReviewSms = (
  application: Application,
  options: {
    clientLocationOrigin: string
  },
  recipient: EmailRecipient,
) => SmsMessage

export const generateRequestReviewSms: RequestReviewSms = (
  application,
  options,
  recipient,
) => {
  const { clientLocationOrigin } = options

  const answers = application.answers as TransferOfMachineOwnerShipAnswers
  const regNumber = answers?.machine?.regNumber

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!regNumber) throw new Error('registration number was undefined')

  const pruneDateStr = getApplicationPruneDateStr(application.created)

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Þín bíður ósamþykkt beiðni um eigendaskipti fyrir tækið ${regNumber} inn á island.is/umsoknir. ` +
      `Til þess að eigendaskiptin verði skráð þarftu að samþykkja beiðnina fyrir ${pruneDateStr}. ` +
      `Slóð á umsóknina: ${clientLocationOrigin}/${ApplicationConfigurations.TransferOfMachineOwnership.slug}/${application.id}.`,
  }
}
