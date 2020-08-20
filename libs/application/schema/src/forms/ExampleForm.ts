import * as z from 'zod'
import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '../lib/formBuilders'
import {
  buildCheckboxField,
  buildIntroductionField,
  buildRadioField,
  buildTextField,
} from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import { nationalIdRegex } from './formUtils'
import { Comparators } from '../types/Condition'
import { FormType } from './FormType'

const ExampleSchema = z.object({
  person: z.object({
    age: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 15
    }),
    name: z
      .string()
      .nonempty()
      .max(256),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    phoneNumber: z.string().min(7),
    email: z.string().email(),
  }),
  careerHistory: z.enum(['yes', 'no']).optional(),
  careerHistoryCompanies: z
    .array(
      // TODO checkbox answers are [undefined, 'aranja', undefined] and we need to do something about it...
      z.union([z.enum(['government', 'aranja', 'advania']), z.undefined()]),
    )
    .nonempty(),
  dreamJob: z.string().optional(),
})

type ExampleSchemaFormValues = z.infer<typeof ExampleSchema>

export const ExampleForm: Form = buildForm({
  id: FormType.EXAMPLE,
  ownerId: 'DOL',
  name: 'Atvinnuleysisbætur',
  schema: ExampleSchema,
  children: [
    buildSection({
      id: 'intro',
      name: 'Upplýsingar',
      children: [
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
              id: 'person.name',
              name: 'Nafn',
              required: true,
            }),
            buildTextField({
              id: 'person.nationalId',
              name: 'Kennitala',
              required: true,
            }),
            buildTextField({
              id: 'person.age',
              name: 'Aldur',
              required: true,
            }),
            buildTextField({
              id: 'person.email',
              name: 'Netfang',
              required: false,
            }),
            buildTextField({
              id: 'person.phoneNumber',
              name: 'Símanúmer',
              required: false,
              condition: {
                questionId: 'person.age',
                isMultiCheck: false,
                comparator: Comparators.GTE,
                value: '18',
              },
            }),
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
              condition: (formValue: ExampleSchemaFormValues) => {
                return formValue?.person?.age >= '18'
              },
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
