import { buildSection } from '@island.is/application/core'
import { applicant as applicantMessage } from '../../../lib/messages'
import { personalInformationSubSection } from './personalInformation'
import { informationChangeAgreement } from './informationChangeAgreement'
import { familyInformationSubSection } from './familyInformation'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicantMessage.general.sectionTitle,
  children: [
    personalInformationSubSection,
    informationChangeAgreement,
    familyInformationSubSection,
  ],
})
