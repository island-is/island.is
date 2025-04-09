import { buildSection } from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'
import { jobWishesSubSection } from './jobWishes'
import { educationHistorySubSection } from './educationHistory'
import { interviewAndMeetingAgreementSubSection } from './interviewAndMeetingAgreement'
import { drivingLicenseSubSection } from './drivingLicense'
import { languageSkillsSubSection } from './languageSkills'
import { euresJobSearchSubSection } from './euresJobSearch'
import { resumeSubSection } from './resume'
import { employmentSearchConfirmationAgreementSubSection } from './employmentSearchConfirmationAgreement'
import { introductoryMeetingAgreementSubSection } from './introductoryMeetingAgreement'

export const employmentSearchSection = buildSection({
  id: 'employmentSearchSection',
  title: applicantMessages.general.sectionTitle,
  children: [
    jobWishesSubSection,
    interviewAndMeetingAgreementSubSection,
    educationHistorySubSection,
    drivingLicenseSubSection,
    languageSkillsSubSection,
    euresJobSearchSubSection,
    resumeSubSection,
    employmentSearchConfirmationAgreementSubSection,
    introductoryMeetingAgreementSubSection,
  ],
})
