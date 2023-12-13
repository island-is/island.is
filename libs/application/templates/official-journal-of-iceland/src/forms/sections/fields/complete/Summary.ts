// Viðaukar og fylgiskjöl

import { buildCustomField } from '@island.is/application/core'
import { CustomField } from '@island.is/application/types'
export const SummaryField: CustomField = buildCustomField({
  id: 'summary',
  title: '',
  component: 'Summary',
})
