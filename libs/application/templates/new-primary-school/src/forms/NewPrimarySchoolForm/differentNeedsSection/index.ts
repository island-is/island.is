import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { healthProtectionSubSection } from './healthProtectionSubSection'
import { languageSubSection } from './languageSubSection'
import { supportSubSection } from './supportSubSection'
import { attachmentSubSection } from './attachmentSubSection'

export const differentNeedsSection = buildSection({
  id: 'differentNeedsSection',
  title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
  children: [
    languageSubSection,
    healthProtectionSubSection,
    supportSubSection,
    attachmentSubSection,
  ],
})
