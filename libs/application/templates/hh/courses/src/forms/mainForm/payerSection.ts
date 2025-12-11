import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const payerSection = buildSection({
  id: 'payerSection',
  title: m.payer.sectionTitle,
  children: [
    buildMultiField({
      id: 'payerSectionMultiField',
      title: m.payer.sectionTitle,
      children: [
        buildTextField({
          id: 'payerNationalId',
          title: m.payer.nationalIdTitle,
          width: 'half',
          format: '######-####',
          required: true,
        }),
        buildTextField({
          id: 'payerName',
          title: m.payer.nameTitle,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
