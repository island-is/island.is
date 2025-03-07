import { buildSection } from '@island.is/application/core'
import { nationalIdWithNameSubsection } from './nationalIdWithNameSubsection'
import { applicantInfoSubsection } from './applicantInfoSubsection'
import { bankAccountSubsection } from './bankAccountSubsection'

export const compositeFieldsSection = buildSection({
  id: 'compositeFieldsSection',
  title: 'Composite fields',
  children: [
    nationalIdWithNameSubsection,
    applicantInfoSubsection,
    bankAccountSubsection,
  ],
})
