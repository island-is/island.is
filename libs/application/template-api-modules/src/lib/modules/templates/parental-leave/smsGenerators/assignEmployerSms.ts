import {
  getApplicationExternalData,
  getUnApprovedEmployers,
} from '@island.is/application/templates/parental-leave'
import { AssignmentSmsTemplateGenerator } from '../../../../types'

export const generateAssignEmployerApplicationSms: AssignmentSmsTemplateGenerator =
  (application, assignLink) => {
    const employers = getUnApprovedEmployers(application.answers)

    const phoneNumber =
      employers.length > 0 ? employers[0].phoneNumber ?? '' : ''
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )
    const applicantId = application.applicant

    return {
      phoneNumber,
      message: `Umsækjandi ${applicantName} kt: ${applicantId} hefur skráð þig sem atvinnuveitanda í umsókn sinni um fæðingarorlof.
    Ef þú áttir von á þessari beiðni máttu smella á linkinn hér fyrir neðan. Kveðja, Fæðingarorlofssjóður ${assignLink}`,
    }
  }
