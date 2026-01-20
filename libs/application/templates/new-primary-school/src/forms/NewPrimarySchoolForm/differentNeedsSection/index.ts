import { buildSection } from '@island.is/application/core'
import { differentNeedsMessages } from '../../../lib/messages'
import { childCircumstancesSubSection } from './childCircumstancesSubSection'
import { healthProtectionSubSection } from './healthProtectionSubSection'
import { languageSubSection } from './languageSubSection'
import { payerSubSection } from './payerSubSection'
import { supportSubSection } from './supportSubSection'
import { termsSubSection } from './termsSubSection'
import { attachmentSubSection } from './attachmentSubSection'
import { specialEducationSupportSubSection } from './specialEducationSupportSubSection'

export const differentNeedsSection = buildSection({
  id: 'differentNeedsSection',
  title: differentNeedsMessages.shared.sectionTitle,
  children: [
    languageSubSection,
    healthProtectionSubSection,
    supportSubSection,
    specialEducationSupportSubSection,
    childCircumstancesSubSection,
    payerSubSection,
    termsSubSection,
    attachmentSubSection,
  ],
})
