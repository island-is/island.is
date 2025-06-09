import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { healthProctectionSubSection } from './healthProctectionSubSection'
import { languageSubSection } from './languageSubSection'
import { supportSubSection } from './supportSubSection'

export const differentNeedsSection = buildSection({
  id: 'differentNeedsSection',
  title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
  children: [
    languageSubSection,
    healthProctectionSubSection,
    supportSubSection,
  ],
})
