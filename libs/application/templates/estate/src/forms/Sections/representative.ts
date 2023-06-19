import {
  buildSection,
  buildMultiField,
  buildTextField,
  buildCustomField,
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
            title: '',
            id: 'representative',
            component: 'LookupPerson',
          },
          {
            requiredNationalId: false,
          },
        ),
        buildTextField({
          id: 'representative.phone',
          title: m.phone,
          width: 'half',
          format: '###-####',
        }),
        buildTextField({
          id: 'representative.email',
          title: m.email,
          width: 'half',
        }),
      ],
    }),
  ],
})
