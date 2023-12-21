import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { summary } from '../../lib/messages'
import { CompleteField } from './fields/complete/Complete'
import { SummaryField } from './fields/complete/Summary'

export const CompleteSection: Section = buildSection({
  id: 'complete',
  title: summary.general.sectionTitle,
  children: [SummaryField, CompleteField],
})
