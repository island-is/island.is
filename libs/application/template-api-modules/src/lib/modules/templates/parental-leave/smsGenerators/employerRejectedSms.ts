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
      message: `Vinnuveitandi þinn samþykkti ekki valið tímabil en óskar eftir nýju og breyttu tímabili. Þú getur gert breytingar á umsókn þinni og sent aftur til skoðunar.
      Your employer did not approve the selected period and requests that you resubmit an alternative period. You can make edits to your application and resubmit for consideration.
    ${link}`,
    }
  }
