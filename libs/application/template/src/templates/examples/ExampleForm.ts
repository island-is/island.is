import * as z from 'zod'
import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '../../lib/formBuilders'
import {
  buildCheckboxField,
  buildIntroductionField,
  buildRadioField,
  buildTextField,
} from '../../lib/fieldBuilders'
import { Form } from '../../types/Form'
import { nationalIdRegex } from './constants'
import { Comparators } from '../../types/Condition'
import { ApplicationTypes } from '../../types/ApplicationTypes'
import { m } from './messages'

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
  id: ApplicationTypes.EXAMPLE,
  ownerId: 'DOL',
  name: 'Atvinnuleysisbætur',
  children: [
    buildSection({
      id: 'intro',
      name: m.introSection,
      children: [
        buildIntroductionField({
          id: 'field',
          name: m.introField,
          introduction: 'Þessi umsókn snýr að atvinnuleysisbótum',
        }),
        buildMultiField({
          id: 'about',
          name: m.about,
          children: [
            buildTextField({
              id: 'person.name',
              name: m.name,
              required: true,
            }),
            buildTextField({
              id: 'person.nationalId',
              name: m.nationalId,
              required: true,
            }),
            buildTextField({
              id: 'person.age',
              name: m.age,
              required: true,
            }),
            buildTextField({
              id: 'person.email',
              name: m.email,
              required: false,
            }),
            buildTextField({
              id: 'person.phoneNumber',
              name: m.phoneNumber,
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
      name: m.career,
      children: [
        buildSubSection({
          id: 'history',
          name: m.history,
          children: [
            buildRadioField({
              id: 'careerHistory',
              name: m.careerHistory,
              required: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
              condition: (formValue: ExampleSchemaFormValues) => {
                return formValue?.person?.age >= '18'
              },
            }),
            buildCheckboxField({
              id: 'careerHistoryCompanies',
              name: m.careerHistoryCompanies,
              required: false,
              options: [
                { value: 'government', label: m.governmentOptionLabel },
                { value: 'aranja', label: 'Aranja' },
                { value: 'advania', label: 'Advania' },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'future',
          name: m.future,
          children: [
            buildTextField({
              id: 'dreamJob',
              name: m.dreamJob,
              required: false,
            }),
          ],
        }),
      ],
    }),
  ],
})
