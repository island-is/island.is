import { buildSection } from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'
import { applicantInformationSubSection } from './personalInformation'
import { informationChangeAgreementSubSection } from './informationChangeAgreement'
import { familyInformationSubSection } from './familyInformation'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicantMessages.general.sectionTitle,
  children: [
    applicantInformationSubSection,
    informationChangeAgreementSubSection,
    familyInformationSubSection,
  ],
})
