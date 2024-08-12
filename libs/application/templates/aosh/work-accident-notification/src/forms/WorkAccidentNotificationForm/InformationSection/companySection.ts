import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { information } from '../../../lib/messages/information'

export const companySection = buildSubSection({
  id: 'company',
  title: information.labels.company.sectionTitle,
  children: [
    buildMultiField({
      id: 'companyMultiField',
      title: information.labels.company.pageTitle,
      description: information.labels.company.description,
      children: [],
    }),
  ],
})
