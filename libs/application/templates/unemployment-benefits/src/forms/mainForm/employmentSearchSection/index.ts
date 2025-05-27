import { buildSection } from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import { jobWishesSubSection } from './jobWishes'
import { educationHistorySubSection } from './educationHistory'
import { interviewAndMeetingAgreementSubSection } from './interviewAndMeetingAgreement'
import { drivingLicenseSubSection } from './drivingLicense'
import { languageSkillsSubSection } from './languageSkills'
import { euresJobSearchSubSection } from './euresJobSearch'
import { resumeSubSection } from './resume'
import { employmentSearchConfirmationAgreementSubSection } from './employmentSearchConfirmationAgreement'
import { introductoryMeetingSubSection } from './introductoryMeeting'

export const employmentSearchSection = buildSection({
  id: 'employmentSearchSection',
  title: employmentSearchMessages.general.sectionTitle,
  children: [
    jobWishesSubSection,
    interviewAndMeetingAgreementSubSection,
    educationHistorySubSection,
    drivingLicenseSubSection,
    languageSkillsSubSection,
    euresJobSearchSubSection,
    resumeSubSection,
    employmentSearchConfirmationAgreementSubSection,
    introductoryMeetingSubSection,
  ],
})
