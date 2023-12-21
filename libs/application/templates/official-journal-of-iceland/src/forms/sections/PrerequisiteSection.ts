import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { prerequisites } from '../../lib/messages'
import { PrerequisitesField } from './fields/prerequisites/PrerequisitesField'
export const PrerequisitesSection: Section = buildSection({
  id: 'ExternalData',
  title: prerequisites.general.sectionTitle,
  children: [PrerequisitesField],
})
