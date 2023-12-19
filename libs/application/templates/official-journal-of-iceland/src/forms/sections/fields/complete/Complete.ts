// Viðaukar og fylgiskjöl

import { buildCustomField, buildMultiField } from '@island.is/application/core'
import { MultiField } from '@island.is/application/types'
export const CompleteField: MultiField = buildMultiField({
  id: 'complete',
  title: '',
  space: 2,
  children: [
    buildCustomField({
      id: 'complete',
      title: '',
      component: 'Complete',
    }),
  ],
})
