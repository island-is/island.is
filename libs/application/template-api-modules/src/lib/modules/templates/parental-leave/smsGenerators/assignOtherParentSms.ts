import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'
import { SmsMessage } from '../../../../types'
import { Application } from '@island.is/application/types'

export type AssingOtherParentGenerator = (
  application: Application,
  link: string,
) => SmsMessage

export const generateAssignOtherParentApplicationSms: AssingOtherParentGenerator =
  (application, link) => {
    const { otherParentPhoneNumber } = getApplicationAnswers(
      application.answers,
    )
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )
    const applicantId = application.applicant

    return {
      phoneNumber: otherParentPhoneNumber,
      message: `Umsækjandi ${applicantName} kt: ${applicantId} hefur skráð þig sem foreldri í umsókn sinni um fæðingarorlof og er að óska eftir réttindum frá þér.
      Ef þú áttir von á þessari beiðni máttu smella á linkinn hér fyrir neðan. Kveðja, Fæðingarorlofssjóður
      ${link}`,
    }
  }
