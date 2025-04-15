import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { exemptionPeriod } from '../../../lib/messages'

export const exemptionPeriodSection = buildSection({
  id: 'exemptionPeriodSection',
  title: exemptionPeriod.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'exemptionPeriodMultiField',
      title: exemptionPeriod.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'TODOx lorem ipsum',
        }),
      ],
    }),
  ],
})
