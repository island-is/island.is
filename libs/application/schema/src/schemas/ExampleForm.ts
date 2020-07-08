import * as z from 'zod'
import {
  buildForm,
  buildSubSection,
  buildMultiField,
  buildSection,
} from '../lib/formBuilders'
import {
  buildCheckboxField,
  buildRadioField,
  buildIntroductionField,
  buildTextField,
} from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import { nationalIdRegex } from './schemaUtils'

const ExampleSchema = z.object({
  name: z
    .string()
    .nonempty()
    .max(256),
  nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
  phoneNumber: z.string().min(7),
  email: z.string().email(),
  careerHistory: z.enum(['yes', 'no']),
  careerHistoryCompanies: z
    .array(
      // TODO checkbox answers are [false, 'aranja', false] and we need to do something about it...
      z.union([z.enum(['government', 'aranja', 'advania']), z.boolean()]),
    )
    .nonempty(),
  dreamJob: z.string().optional(),
})

export const ExampleForm: Form = buildForm({
  id: 'example',
  ownerId: 'DOL',
  name: 'Atvinnuleysisbætur',
  schema: ExampleSchema,
  children: [
    buildSection({
      id: 'intro',
      name: 'Upplýsingar',
      children: [
        buildCheckboxField({
          id: 'careerHistoryCompanies',
          name: 'Hefurðu unnið fyrir eftirfarandi aðila?',
          required: false,
          options: [
            { value: 'government', label: 'Ríkið' },
            { value: 'aranja', label: 'Aranja' },
            { value: 'advania', label: 'Advania' },
          ],
        }),
        buildIntroductionField({
          id: 'field',
          name: 'Velkomin(n)',
          introduction: 'Þessi umsókn snýr að atvinnuleysisbótum',
        }),
        buildMultiField({
          id: 'about',
          name: 'Um þig',
          children: [
            buildTextField({
              id: 'name',
              name: 'Nafn',
              required: true,
            }),
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
    }),
    buildSection({
      id: 'career',
      name: 'Starfsferill',
      children: [
        buildSubSection({
          id: 'history',
          name: 'Hvar hefur þú unnið áður?',
          children: [
            buildRadioField({
              id: 'careerHistory',
              name: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
              required: true,
              options: [
                { value: 'yes', label: 'Já' },
                { value: 'no', label: 'Nei' },
              ],
            }),
            buildCheckboxField({
              id: 'careerHistoryCompanies',
              name: 'Hefurðu unnið fyrir eftirfarandi aðila?',
              required: false,
              options: [
                { value: 'government', label: 'Ríkið' },
                { value: 'aranja', label: 'Aranja' },
                { value: 'advania', label: 'Advania' },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'future',
          name: 'Hvar langar þig að vinna?',
          children: [
            buildTextField({
              id: 'dreamJob',
              name: 'Einhver draumavinnustaður?',
              required: false,
            }),
          ],
        }),
      ],
    }),
  ],
})
