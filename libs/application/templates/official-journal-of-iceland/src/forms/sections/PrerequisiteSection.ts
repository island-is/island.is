import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { PublishingPreferencesField } from './fields/draft/PublishingPrefrences'
import { PrerequisitesField } from './fields/prerequisites/PrerequisitesField'
export const PrerequisitesSection: Section = buildSection({
  id: 'ExternalData',
  title: m.prerequisitesSectionTitle,
  children: [PublishingPreferencesField, PrerequisitesField],
})
