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
  buildSelectField,
  buildCustomField,
} from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import { nationalIdRegex } from './formUtils'
import { CustomFieldComponents } from '../types/Fields'
import { FormType } from './FormType'

const ExampleSchema = z.object({
  country: z.string().nonempty(),
  person: z.object({
    age: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 0
    }),
    name: z
      .string()
      .nonempty()
      .max(256),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    phoneNumber: z.string().min(7),
    email: z.string().email(),
  }),
  historyCars: z
    .array(
      // TODO checkbox answers are [undefined, 'aranja', undefined] and we need to do something about it...
      z.union([
        z.enum(['VW', 'Audi', 'Porsche', 'Tesla', 'none']),
        z.undefined(),
      ]),
    )
    .nonempty(),
  historyLicense: z.enum(['yes', 'no']),
  // eslint-disable-next-line @typescript-eslint/camelcase
  historyLicense_where: z
    .string()
    .nonempty()
    .max(256),
  instructor: z.enum(['1', '2', '3', '4']),
  carNeeded: z.enum(['yes', 'no']),
  transmission: z.enum(['manual', 'automatic']),
  paymentType: z.enum(['credit', 'bank']),
  creditCard: z.string().refine((x) => {
    const asNumber = parseInt(x)
    if (isNaN(asNumber)) {
      return false
    }
    return true
  }),
  bankAccount: z.string().refine((x) => {
    const asNumber = parseInt(x)
    if (isNaN(asNumber)) {
      return false
    }
    return true
  }),
})

type ExampleSchemaFormValues = z.infer<typeof ExampleSchema>

export const ExampleForm3: Form = buildForm({
  id: FormType.EXAMPLE3,
  ownerId: 'DOL',
  name: "Driver's license",
  schema: ExampleSchema,
  children: [
    buildSection({
      id: 'student',
      name: 'Student',
      children: [
        buildIntroductionField({
          id: 'field',
          name: 'Welcome',
          introduction: "This is a sample driver's license application.",
        }),
        buildSubSection({
          id: 'student',
          name: 'Student Information',
          children: [
            buildTextField({
              id: 'person.name',
              name: 'Name',
              required: true,
            }),
            buildCheckboxField({
              id: 'historyCars',
              name: 'Which cars have you driven before?',
              required: false,
              options: [
                {
                  value: 'VW',
                  label: 'VW',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'Audi',
                  label: 'Audi',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'Porsche',
                  label: 'Porsche',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'Tesla',
                  label: 'Tesla',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'none',
                  label: 'None of these',
                  excludeOthers: true,
                },
              ],
            }),
            buildCustomField(
              {
                id: 'country',
                name: 'Where are you from?',
                component: CustomFieldComponents.Country,
              },
              {},
            ),
          ],
        }),
        buildSubSection({
          id: 'background',
          name: 'Driving background',
          children: [
            buildRadioField({
              id: 'historyLicense',
              name: "Have you had a driver's license before?",
              required: true,
              options: [
                {
                  value: 'yes',
                  label: 'Yes',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                { value: 'no', label: 'No' },
              ],
            }),
            buildTextField({
              id: 'historyLicense_where',
              name: 'Where was your license from?',
              required: true,
              condition: (formValue: ExampleSchemaFormValues) => {
                return formValue?.historyLicense === 'yes'
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'intro',
      name: 'Instructor',
      children: [
        buildSubSection({
          id: 'instructorInfo',
          name: 'Instructor Information',
          children: [
            buildSelectField({
              id: 'instructor',
              name: 'Which instructor would you like to drive with?',
              placeholder: 'Select instructor',
              options: [
                {
                  label: 'Ingólfur Jónsson (101)',
                  value: '1',
                },
                {
                  label: 'Hallveig Traustadóttir (105)',
                  value: '2',
                },
                {
                  label: 'Björn Egilsson (107)',
                  value: '3',
                },
                {
                  label: 'Auður Egilsdóttir (170)',
                  value: '4',
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'carInfo',
          name: 'Car Information',
          children: [
            buildMultiField({
              id: 'car',
              name: 'Car for training and test',
              children: [
                buildRadioField({
                  id: 'carNeeded',
                  name: "Will you need to use an instructor's car?",
                  required: true,
                  options: [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ],
                }),
                buildRadioField({
                  id: 'transmission',
                  name: 'What type of transmission do you prefer?',
                  required: true,
                  options: [
                    { value: 'manual', label: 'Manual' },
                    { value: 'automatic', label: 'Automatic' },
                  ],
                  condition: (formValue: ExampleSchemaFormValues) => {
                    return formValue?.carNeeded === 'yes'
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      name: 'Payment Information',
      children: [
        buildRadioField({
          id: 'paymentType',
          name: 'Which payment method will you use?',
          required: true,
          options: [
            { value: 'credit', label: 'Credit card' },
            { value: 'bank', label: 'Bank transfer' },
          ],
        }),
        buildTextField({
          id: 'creditCard',
          name: 'Card number',
          condition: (formValue: ExampleSchemaFormValues) => {
            return formValue?.paymentType === 'credit'
          },
        }),
        buildTextField({
          id: 'bankAccount',
          name: 'Bank account number',
          condition: (formValue: ExampleSchemaFormValues) => {
            return formValue?.paymentType === 'bank'
          },
        }),
        buildIntroductionField({
          id: 'Summary',
          name: 'Next steps',
          introduction:
            'The instructor will contact you after you submit this application.',
        }),
      ],
    }),
  ],
})
