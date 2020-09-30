import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildCheckboxField,
  buildIntroductionField,
  buildRadioField,
  buildTextField,
  Form,
  Comparators,
  ApplicationTypes,
  FormValue,
} from '@island.is/application/core'
import { m } from './messages'

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
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { person: { age: string } })?.person?.age >=
                  '18'
                )
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
    buildSection({
      id: 'confirmation',
      name: 'Staðfesta',
      children: [
        buildIntroductionField({
          id: 'overview',
          name: 'Takk fyrir að sækja um',
          introduction:
            'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
        }),
        buildIntroductionField({
          id: 'final',
          name: 'Takk',
          introduction: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
