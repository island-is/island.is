import { buildCustomField, buildMultiField } from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const overviewMultiField = buildMultiField({
  id: 'overview',
  title: m.yearlyOverview,
  description: m.review,
  children: [
    buildCustomField({
      id: 'overviewCemetryField',
      title: '',
      doesNotRequireAnswer: true,
      component: 'CemeteryOverview',
    }),
  ],
})
