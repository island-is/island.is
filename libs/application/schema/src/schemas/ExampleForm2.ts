import { buildForm, buildMultiField } from '../lib/formBuilders'
import { buildTextField } from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import * as z from 'zod'
import { nationalIdRegex } from './schemaUtils'

const ExampleSchema2 = z.object({
  name: z
    .string()
    .nonempty()
    .max(256),
  nationalId: z.string().refine(nationalIdRegex.test),
  phoneNumber: z.string().min(7),
})

export const ExampleForm2: Form = buildForm({
  id: 'example2',
  ownerId: 'FOS',
  name: 'Fæðingarorlofssjóður',
  schema: ExampleSchema2,
  children: [
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
