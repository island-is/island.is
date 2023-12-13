// Viðaukar og fylgiskjöl

import { buildCustomField } from '@island.is/application/core'
import { CustomField } from '@island.is/application/types'
export const NewCaseField: CustomField = buildCustomField({
  id: 'basicInformation',
  title: '',
  component: 'BasicInformation',
})
