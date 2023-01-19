import { getApplicationExternalData } from '@island.is/application/templates/parental-leave'
import { AssignmentSmsTemplateGenerator } from '../../../../types'
import { getValueViaPath } from '@island.is/application/core'

export const generateAssignEmployerApplicationSms: AssignmentSmsTemplateGenerator = (
  application,
  assignLink,
) => {
  const phoneNumber =
    getValueViaPath<string>(application.answers, 'contact.phoneNumber') ?? ''
  const { applicantName } = getApplicationExternalData(application.externalData)
  const applicantId = application.applicant

  return {
    phoneNumber,
    message: `Umsækjandi ${applicantName} kt: ${applicantId} hefur skráð þig sem atvinnuveitanda í umsókn sinni um fæðingarorlof.
    Ef þú áttir von á þessari beiðni máttu smella á linkinn hér fyrir neðan. Kveðja, Fæðingarorlofssjóður ${assignLink}`,
  }
}
