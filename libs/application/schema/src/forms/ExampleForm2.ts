import { buildForm, buildMultiField } from '../lib/formBuilders'
import { buildSelectField, buildTextField } from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import * as z from 'zod'
import { nationalIdRegex } from './formConstants'
import { FormType } from './FormType'

const ExampleSchema2 = z.object({
  name: z
    .string()
    .nonempty()
    .max(256),
  nationalId: z.string().refine(nationalIdRegex.test),
  phoneNumber: z.string().min(7),
  selection: z.enum(['1', '2', '3', '4']),
})

export const ExampleForm2: Form = buildForm({
  id: FormType.EXAMPLE2,
  ownerId: 'FOS',
  name: 'Fæðingarorlofssjóður',
  schema: ExampleSchema2,
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
