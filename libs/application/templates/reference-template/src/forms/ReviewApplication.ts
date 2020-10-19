import {
  buildCheckboxField,
  buildDividerField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildReviewField,
  buildSection,
  buildTextField,
  Form,
} from '@island.is/application/core'
import { m } from './messages'

export const ReviewApplication: Form = buildForm({
  id: 'ExampleInReview',
  name: 'Úrvinnsla umsóknar um atvinnuleysisbætur',
  children: [
    buildSection({
      id: 'intro',
      name: m.introSection,
      children: [
        buildMultiField({
          id: 'about',
          name: m.about,
          children: [
            buildDividerField({ name: 'Umsækjandi' }),
            buildTextField({
              id: 'person.name',
              name: m.name,
              disabled: true,
            }),
            buildTextField({
              id: 'person.nationalId',
              name: m.nationalId,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'person.age',
              name: m.age,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'person.email',
              name: m.email,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'person.phoneNumber',
              name: m.phoneNumber,
              disabled: true,
              width: 'half',
            }),
            buildDividerField({ name: 'Atvinna' }),
            buildRadioField({
              id: 'careerHistory',
              name: m.careerHistory,
              width: 'half',
              disabled: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildCheckboxField({
              id: 'careerHistoryCompanies',
              name: m.careerHistoryCompanies,
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
              name: m.dreamJob,
              disabled: true,
            }),
            buildReviewField({
              id: 'approvedByReviewer',
              name: 'Samþykkirðu þessa umsókn?',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'final',
          name: 'Takk fyrir',
          introduction:
            'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
        }),
      ],
    }),
  ],
})
