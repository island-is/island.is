import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { isPersonalTaxReturnSuccessWithEmptyPayments } from '../../utils/utils'

export const posessionsSection = buildSection({
  id: 'posessionsSection',
  title: 'Eignir',
  condition: isPersonalTaxReturnSuccessWithEmptyPayments,
  children: [
    buildMultiField({
      id: 'posessions',
      title: 'Eignir',
      children: [
        buildTextField({
          id: 'posessions.name',
          title: 'Nafn',
        }),
      ],
    }),
  ],
})
