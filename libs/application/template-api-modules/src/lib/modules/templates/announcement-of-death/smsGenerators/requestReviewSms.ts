import { Application } from '@island.is/application/types'
import { ApplicationConfigurations } from '@island.is/application/types'
import { SmsMessage } from '../../../../types'
import { AnnouncementOfDeathAnswers } from '@island.is/application/templates/announcement-of-death'

export type RequestReviewSms = (
  application: Application,
  options: {
    clientLocationOrigin: string
  },
) => SmsMessage

export const generateRequestReviewSms: RequestReviewSms = (
  application,
  options,
) => {
  const { clientLocationOrigin } = options

  const applicant =
    application.answers as AnnouncementOfDeathAnswers['firearmApplicant']

  if (!applicant?.phone) throw new Error('Recipient phone was undefined')

  return {
    phoneNumber: applicant.phone || '',
    message:
      `Góðan dag,` +
      `þú hefur verið tilnefndur til að taka við vörslu eftirtalinna skotvopna sem tilheyra dánarbúi X: ${'TEST'} og ${'TEST'}` +
      `Með undirritun lýsir þú því yfir að þú hafir leyfi til að varsla skotvopnin og samþykkir jafnframt að taka við vörslu þeirra.`,
  }
}
