import { getApplicationAnswers } from '@island.is/application/templates/parental-leave'
import { SmsMessage } from '../../../../types'
import { Application } from '@island.is/application/types'

export type EmployerRejectedGenerator = (
  application: Application,
  link: string,
) => SmsMessage

export const generateEmployerRejectedApplicationSms: EmployerRejectedGenerator =
  (application, link) => {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    return {
      phoneNumber: applicantPhoneNumber,
      message: `Vinnuveitandi hefur hafnað beiðni þinni um samþykki fæðingarorlofs. Þú þarft því að breyta umsókn þinni.
    Your employer has denied your request. You therefore need to modify your application.
    ${link}`,
    }
  }
