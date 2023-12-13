import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { CompleteField } from './fields/complete/Complete'
import { SummaryField } from './fields/complete/Summary'

export const CompleteSection: Section = buildSection({
  id: 'complete',
  title: m.summarySectionTitle,
  children: [SummaryField, CompleteField],
})
