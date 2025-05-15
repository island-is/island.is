import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { ApplicationConfigurations } from '@island.is/application/types'
import { getApplicationPruneDateStr } from '../training-license-on-a-work-machine.utils'

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

  if (!recipient.phone) throw new Error('Recipient phone was undefined')

  const pruneDateStr = getApplicationPruneDateStr(application.created)

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Þín bíður beiðni um samþykki á starfstíma á vinnuvél á island.is/umsoknir. ` +
      `Til þess að kennsluréttindi á vinnuvél verði skráð þarftu að samþykkja beiðnina fyrir ${pruneDateStr}. ` +
      `Slóð á umsóknina: ${clientLocationOrigin}/${ApplicationConfigurations.TrainingLicenseOnAWorkMachine.slug}/${application.id}.`,
  }
}
