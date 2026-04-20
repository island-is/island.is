import { buildSection } from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'
import { reasonForJobSearchSubSection } from './reasonForJobSearch'
import { yourRightsAgreementSubSection } from './yourRightsAgreement'
import { currentSituationSubSection } from './currentSituation'
import { concurrentWorkAgreementSubSection } from './concurrentWorkAgreement'
import { workingAbilitySubSection } from './workingAbility'
import { employmentHistorySubSection } from './employmentHistory'
import { lossOfRightsAgreementSubSection } from './lossOfRightsAgreement'

export const employmentInformationSection = buildSection({
  id: 'employmentInformationSection',
  title: employmentMessages.general.sectionTitle,
  children: [
    reasonForJobSearchSubSection,
    yourRightsAgreementSubSection,
    currentSituationSubSection,
    concurrentWorkAgreementSubSection,
    workingAbilitySubSection,
    employmentHistorySubSection,
    lossOfRightsAgreementSubSection,
  ],
})
