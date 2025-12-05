import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { childCircumstancesSubSection } from './childCircumstancesSubSection'
import { healthProtectionSubSection } from './healthProtectionSubSection'
import { languageSubSection } from './languageSubSection'
import { payerSubSection } from './payerSubSection'
import { specialEducationSupportSubSection } from './specialEducationSupportSubSection'
import { supportSubSection } from './supportSubSection'
import { termsSubSection } from './termsSubSection'

export const differentNeedsSection = buildSection({
  id: 'differentNeedsSection',
  title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
  children: [
    languageSubSection,
    healthProtectionSubSection,
    supportSubSection,
    specialEducationSupportSubSection,
    childCircumstancesSubSection,
    payerSubSection,
    termsSubSection,
  ],
})
