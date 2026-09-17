import {
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { isCompany } from 'kennitala'
import { GuitarAndWheelchair } from '@island.is/application/assets/graphics'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'
import {
  getEarliestSubmissionDate,
  getSalaryIneligibilityReason,
  SALARY_INELIGIBILITY_RENEWAL_WINDOW_NOT_OPEN,
} from '../../utils/eligibility'
import { formatBackendDate } from '../../utils/dates'

// This form renders for three different rejection reasons. mapUserToRole sends
// non-company applicants here directly (no externalData fetched yet), which
// isCompany(application.applicant) is what tells apart — it is available in
// every case. The other two are DMR's own answer, and the state's read scope
// grants this form the eligibility externalData precisely so it can tell them
// apart: the company owes a jafnréttisáætlun, or it holds one and the
// three-year renewal window has not opened yet.
const isRenewalWindowClosed = (application: Application) =>
  getSalaryIneligibilityReason(application) ===
  SALARY_INELIGIBILITY_RENEWAL_WINDOW_NOT_OPEN

const notAllowedTitle = (application: Application): StaticText => {
  if (!isCompany(application.applicant)) {
    return messages.notAllowed.notCompanyTitle
  }
  return isRenewalWindowClosed(application)
    ? messages.notAllowed.renewalWindowTitle
    : messages.notAllowed.title
}

const notAllowedDescription = (application: Application): StaticText => {
  if (!isCompany(application.applicant)) {
    return messages.notAllowed.notCompanyDescription
  }
  if (!isRenewalWindowClosed(application)) {
    return messages.notAllowed.description
  }

  const earliestSubmissionDate = formatBackendDate(
    getEarliestSubmissionDate(application),
  )
  return earliestSubmissionDate
    ? {
        ...messages.notAllowed.renewalWindowDescription,
        values: { earliestSubmissionDate },
      }
    : messages.notAllowed.renewalWindowDescriptionNoDate
}

export const NotAllowedForm = buildForm({
  id: 'NotAllowedForm',
  logo: DirectorateOfEqualityLogo,
  children: [
    buildSection({
      id: 'notAllowedSection',
      tabTitle: messages.notAllowed.title,
      children: [
        buildMultiField({
          id: 'notAllowedMultiField',
          title: notAllowedTitle,
          description: notAllowedDescription,
          children: [
            buildImageField({
              id: 'notAllowedImage',
              image: GuitarAndWheelchair,
              alt: '',
              imageWidth: 'auto',
              imagePosition: 'center',
            }),
          ],
        }),
      ],
    }),
  ],
})
