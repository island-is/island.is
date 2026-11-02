import { getApplicationAnswers } from '@island.is/application/templates/parental-leave'
import { SmsMessage } from '../../../../types'
import { Application } from '@island.is/application/types'

export type OtherParentRejectedGenerator = (
  application: Application,
  link: string,
) => SmsMessage

export const generateOtherParentRejectedApplicationSms: OtherParentRejectedGenerator =
  (application, link) => {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    return {
      phoneNumber: applicantPhoneNumber,
      message: `Hitt foreldrið hefur hafnað beiðni þinni um yfirfærslu á réttindum. Þú þarft því að breyta umsókn þinni.
      The other parent has denied your request for transfer of rights. You therefore need to modify your application.
      ${link}`,
    }
  }
