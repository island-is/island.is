// Viðaukar og fylgiskjöl

import { buildCustomField, buildMultiField } from '@island.is/application/core'
import { MultiField } from '@island.is/application/types'
export const CompleteField: MultiField = buildMultiField({
  id: 'additionsAndDocuments',
  title: '',
  space: 2,
  children: [
    buildCustomField({
      id: 'additionsAndDocuments',
      title: '',
      component: 'Complete',
    }),
  ],
})
