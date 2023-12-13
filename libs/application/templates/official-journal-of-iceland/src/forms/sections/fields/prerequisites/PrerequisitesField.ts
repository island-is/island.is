import { buildCustomField } from '@island.is/application/core'
import { CustomField } from '@island.is/application/types'

export const PrerequisitesField: CustomField = buildCustomField({
  id: 'prerequisites',
  title: '',
  component: 'Prerequisites',
})
