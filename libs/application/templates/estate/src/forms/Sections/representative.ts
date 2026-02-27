import {
  buildSection,
  buildMultiField,
  buildTextField,
  buildCustomField,
  buildPhoneField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const representative = buildSection({
  id: 'representative',
  title: m.representativeTitle,
  children: [
    buildMultiField({
      id: 'representative',
      title: m.representativeTitle,
      description: m.representativeDescription,
      children: [
        buildCustomField(
          {
            id: 'representative',
            component: 'LookupPerson',
          },
          {
            requiredNationalId: false,
            alertWhenUnder18: true,
          },
        ),
        buildPhoneField({
          id: 'representative.phone',
          title: m.phone,
          width: 'half',
          required: true,
          enableCountrySelector: true,
        }),
        buildTextField({
          id: 'representative.email',
          title: m.email,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
