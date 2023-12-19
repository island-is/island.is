import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { CompleteField } from './fields/complete/Complete'
import { SummaryField } from './fields/complete/Summary'
import { PrerequisitesField } from './fields/prerequisites/PrerequisitesField'
export const PrerequisitesSection: Section = buildSection({
  id: 'ExternalData',
  title: m.prerequisitesSectionTitle,
  children: [SummaryField, CompleteField, PrerequisitesField],
})
