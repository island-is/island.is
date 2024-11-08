import { buildSection } from '@island.is/application/core'
import { nationalIdWithNameSubsection } from './nationalIdWithNameSubsection'
import { applicantInfoSubsection } from './applicantInfoSubsection'

export const compositeFieldsSection = buildSection({
  id: 'compositeFieldsSection',
  title: 'Composite fields',
  children: [nationalIdWithNameSubsection, applicantInfoSubsection],
})
