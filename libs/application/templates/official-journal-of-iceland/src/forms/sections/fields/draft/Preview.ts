// Forskoðun
// Viðaukar og fylgiskjöl

import { buildCustomField, buildMultiField } from '@island.is/application/core'
import { MultiField } from '@island.is/application/types'
export const PreviewField: MultiField = buildMultiField({
  id: 'PreviewField',
  title: '',
  children: [
    buildCustomField({
      id: 'Preview',
      title: '',
      component: 'Preview',
    }),
  ],
})
