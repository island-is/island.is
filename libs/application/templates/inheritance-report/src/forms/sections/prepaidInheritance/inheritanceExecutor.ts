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
          condition: (answers) =>
            !!((answers.executors as any)?.includeSpouse as Array<string>)
              ?.length,
        }),
        buildNationalIdWithNameField({
          id: 'executors.spouse',
          required: true,
          condition: (answers) =>
            !!((answers.executors as any)?.includeSpouse as Array<string>)
              ?.length,
        }),
        buildTextField({
          id: 'executors.spouse.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          required: true,
          condition: (answers) =>
            !!((answers.executors as any)?.includeSpouse as Array<string>)
              ?.length,
        }),
        buildPhoneField({
          id: 'executors.spouse.phone',
          title: m.phone,
          width: 'half',
          required: true,
          condition: (answers) =>
            !!((answers.executors as any)?.includeSpouse as Array<string>)
              ?.length,
        }),
      ],
    }),
  ],
})
