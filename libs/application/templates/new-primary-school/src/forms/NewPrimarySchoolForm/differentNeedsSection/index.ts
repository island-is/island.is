import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { childCircumstancesSubSection } from './childCircumstancesSubSection'
import { healthProtectionSubSection } from './healthProtectionSubSection'
import { languageSubSection } from './languageSubSection'
import { payerSubSection } from './payerSubSection'
import { supportSubSection } from './supportSubSection'

export const differentNeedsSection = buildSection({
  id: 'differentNeedsSection',
  title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
  children: [
    languageSubSection,
    healthProtectionSubSection,
    supportSubSection,
    childCircumstancesSubSection,
    payerSubSection,
  ],
})
