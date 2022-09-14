import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'
import { SmsTemplateGenerator } from '../../../../types'
import { linkOtherParentSMS } from '../emailGenerators'

export const generateAssignOtherParentApplicationSms: SmsTemplateGenerator = (
  application,
) => {
  const { otherParentPhoneNumber } = getApplicationAnswers(application.answers)
  const { applicantName } = getApplicationExternalData(application.externalData)
  const applicantId = application.applicant

  return {
    phoneNumber: otherParentPhoneNumber,
    message: `Umsækjandi ${applicantName} kt: ${applicantId} hefur skráð þig sem maka í umsókn sinni um fæðingarorlof og er að óska eftir réttindum frá þér.
      Ef þú áttir von á þessari beiðni máttu smella á linkinn hér fyrir neðan. Kveðja, Fæðingarorlofssjóður
      ${linkOtherParentSMS}`,
  }
}
