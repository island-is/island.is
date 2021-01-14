import {
  buildCheckboxField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
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
  title: 'Atvinnuleysisbætur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildTextField({
          id: 'person.name',
          title: m.name,
        }),
        buildDescriptionField({
          id: 'field',
          title: m.introField,
          description: (application) => ({
            ...m.introIntroduction,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            values: { name: application.answers.person?.name },
          }),
        }),
        buildMultiField({
          id: 'about',
          title: m.about,
          children: [
            buildTextField({
              id: 'person.nationalId',
              title: m.nationalId,
            }),
            buildTextField({
              id: 'person.age',
              title: m.age,
            }),
            buildTextField({
              id: 'person.email',
              title: m.email,
            }),
            buildTextField({
              id: 'person.phoneNumber',
              title: m.phoneNumber,
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
      title: m.career,
      children: [
        buildSubSection({
          id: 'history',
          title: m.history,
          children: [
            buildRadioField({
              id: 'careerHistory',
              title: m.careerHistory,
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
              title: m.careerHistoryCompanies,
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
          title: m.future,
          children: [
            buildTextField({
              id: 'dreamJob',
              title: m.dreamJob,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [
        buildMultiField({
          title: '',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Senda inn umsókn',
              actions: [
                { event: 'SUBMIT', name: 'Senda inn umsókn', type: 'primary' },
              ],
            }),
            buildDescriptionField({
              id: 'overview',
              title: 'Takk fyrir að sækja um',
              description:
                'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
