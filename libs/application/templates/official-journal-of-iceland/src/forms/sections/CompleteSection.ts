import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { CompleteField } from './fields/complete/Complete'
import { SummaryField } from './fields/complete/Summary'

export const CompleteSection: Section = buildSection({
  id: 'complete',
  title: '',
  children: [SummaryField, CompleteField],
})
