import {
  buildCheckboxField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const ReviewApplication: Form = buildForm({
  id: 'ExampleInReview',
  title: 'Úrvinnsla umsóknar um atvinnuleysisbætur',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildMultiField({
          id: 'about',
          title: m.about,
          children: [
            buildTitleField({ title: 'Umsækjandi', color: 'blue400' }),
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
            buildTitleField({ title: 'Atvinna', color: 'blue400' }),
            buildRadioField({
              id: 'careerHistory',
              title: 'def',
              width: 'half',
              disabled: true,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
            }),
            buildCheckboxField({
              id: 'careerHistoryDetails.careerHistoryCompanies',
              title: 'abc',
              disabled: true,
              width: 'half',
              options: [
                { value: 'government', label: m.governmentOptionLabel },
                { value: 'aranja', label: 'Aranja' },
                { value: 'advania', label: 'Advania' },
                { value: 'other', label: 'Annað' },
              ],
            }),
            buildTextField({
              id: 'careerHistoryDetails.careerHistoryOther',
              disabled: true,
              title: 'ghi',
            }),
            buildTextField({
              id: 'dreamJob',
              title: 'jkl',
              disabled: true,
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              placement: 'screen',
              title: 'Do yo uapprove this application?',
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
            'Your processing is complete. The application has been forwarded to the next step.',
        }),
      ],
    }),
  ],
})
