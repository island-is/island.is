import { Application } from '@island.is/application/types'
import { SmsMessage } from '../../../../types'
import { AnnouncementOfDeathAnswers } from '@island.is/application/templates/announcement-of-death'

export type RequestReviewSms = (application: Application) => SmsMessage

export const generateRequestReviewSms: RequestReviewSms = (application) => {
  const firearmApplicant = application.answers
    .firearmApplicant as AnnouncementOfDeathAnswers['firearmApplicant']

  if (!firearmApplicant?.phone) throw new Error('Recipient phone was undefined')

  return {
    phoneNumber: firearmApplicant.phone || '',
    message:
      `Góðan dag,` +
      `þú hefur verið tilnefndur til að taka við vörslu skotvopna sem tilheyra dánarbúi ${application.answers.caseNumber} - ${firearmApplicant.name}` +
      `Með undirritun lýsir þú því yfir að þú hafir leyfi til að varsla skotvopnin og samþykkir jafnframt að taka við vörslu þeirra.`,
  }
}
