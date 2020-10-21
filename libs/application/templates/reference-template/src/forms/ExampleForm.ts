import {
  buildCheckboxField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
  Comparators,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/core'
import { m } from './messages'

export const ExampleForm: Form = buildForm({
  id: 'ExampleFormDraft',
  name: 'Atvinnuleysisbætur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'intro',
      name: m.introSection,
      children: [
        buildTextField({
          id: 'person.name',
          name: m.name,
        }),
        buildIntroductionField({
          id: 'field',
          name: m.introField,
          introduction: (application) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            `Halló ${application.answers.person?.name}`,
        }),
        buildMultiField({
          id: 'about',
          name: m.about,
          children: [
            buildTextField({
              id: 'person.nationalId',
              name: m.nationalId,
            }),
            buildTextField({
              id: 'person.age',
              name: m.age,
            }),
            buildTextField({
              id: 'person.email',
              name: m.email,
            }),
            buildTextField({
              id: 'person.phoneNumber',
              name: m.phoneNumber,
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
