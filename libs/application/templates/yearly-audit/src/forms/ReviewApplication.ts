import {
  buildCheckboxField,
  buildDividerField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const ReviewApplication: Form = buildForm({
  id: 'ExampleInReview',
  title: 'Úrvinnsla umsóknar um atvinnuleysisbætur',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildMultiField({
          id: 'about',
          title: m.about,
          children: [
            buildDividerField({ title: 'Umsækjandi' }),
            buildTextField({
              id: 'person.name',
              title: m.personName,
              disabled: true,
            }),
            buildTextField({
              id: 'person.nationalId',
              title: m.nationalId,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'person.age',
              title: m.age,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'person.email',
              title: m.email,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'person.phoneNumber',
              title: m.phoneNumber,
              disabled: true,
              width: 'half',
            }),
            buildDividerField({ title: 'Atvinna' }),
            buildRadioField({
              id: 'careerHistory',
              title: m.careerHistory,
              width: 'half',
              disabled: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildCheckboxField({
              id: 'careerHistoryCompanies',
              title: m.careerHistoryCompanies,
              disabled: true,
              width: 'half',
              options: [
                { value: 'government', label: m.governmentOptionLabel },
                { value: 'aranja', label: 'Aranja' },
                { value: 'advania', label: 'Advania' },
              ],
            }),
            buildTextField({
              id: 'dreamJob',
              title: m.dreamJob,
              disabled: true,
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              placement: 'screen',
              title: 'Samþykkirðu þessa umsókn?',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk fyrir',
          description:
            'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
        }),
      ],
    }),
  ],
})
