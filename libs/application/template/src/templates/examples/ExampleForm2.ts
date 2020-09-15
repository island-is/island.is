import { buildForm, buildMultiField } from '../../lib/formBuilders'
import { buildSelectField, buildTextField } from '../../lib/fieldBuilders'
import { Form } from '../../types/Form'
import { ApplicationTypes } from '../../types/ApplicationTypes'

export const ExampleForm2: Form = buildForm({
  id: ApplicationTypes.EXAMPLE2,
  ownerId: 'FOS',
  name: 'Fæðingarorlofssjóður',
  children: [
    buildSelectField({
      id: 'selection',
      name: 'Prófum select',
      placeholder: 'Voða fínn pleishólder',
      options: [
        {
          label: 'Valmöguleiki 1',
          value: '1',
        },
        {
          label: 'Valmöguleiki 2',
          value: '2',
        },
        {
          label: 'Valmöguleiki 3',
          value: '3',
        },
        {
          label: 'Valmöguleiki 4',
          value: '4',
        },
      ],
    }),
    buildMultiField({
      id: 'about',
      name: 'Um þig',
      children: [
        buildTextField({ id: 'name', name: 'Nafn', required: true }),
        buildTextField({
          id: 'nationalId',
          name: 'Kennitala',
          required: true,
        }),
        buildTextField({
          id: 'phoneNumber',
          name: 'Símanúmer',
          required: false,
        }),
        buildTextField({ id: 'email', name: 'Netfang', required: false }),
      ],
    }),
  ],
})
