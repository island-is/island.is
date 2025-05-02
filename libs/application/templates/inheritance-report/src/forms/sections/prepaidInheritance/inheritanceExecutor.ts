import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { includeSpouse } from '../../../lib/utils/helpers'

export const inheritanceExecutor = buildSection({
  id: 'inheritanceExecutor',
  title: m.grantors,
  children: [
    buildMultiField({
      id: 'inheritanceExecutor',
      title: m.grantors,
      description: m.grantorsDescription,
      children: [
        buildDescriptionField({
          id: 'description.executors.executor',
          title: m.grantor,
          titleVariant: 'h3',
        }),
        buildNationalIdWithNameField({
          id: 'executors.executor',
          required: true,
        }),
        buildTextField({
          id: 'executors.executor.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          required: true,
        }),
        buildPhoneField({
          id: 'executors.executor.phone',
          title: m.phone,
          width: 'half',
          required: true,
          enableCountrySelector: true,
        }),
        buildDescriptionField({
          id: 'description_empty',
          marginBottom: 'p5',
        }),
        buildCheckboxField({
          id: 'executors.includeSpouse',
          large: false,
          backgroundColor: 'white',
          defaultValue: [],
          description: m.includeSpousePrePaidDescription,
          options: [
            {
              value: YES,
              label: m.includeSpousePrePaid,
            },
          ],
        }),
        buildDescriptionField({
          id: 'description.executors.spouse',
          title: m.grantor,
          titleVariant: 'h3',
          space: 'containerGutter',
          condition: includeSpouse,
        }),
        buildNationalIdWithNameField({
          id: 'executors.spouse',
          required: true,
          condition: includeSpouse,
        }),
        buildTextField({
          id: 'executors.spouse.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          required: true,
          condition: includeSpouse,
        }),
        buildPhoneField({
          id: 'executors.spouse.phone',
          title: m.phone,
          width: 'half',
          required: true,
          condition: includeSpouse,
        }),
      ],
    }),
  ],
})
