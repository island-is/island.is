import {
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildIntroductionField,
  buildTextField,
  Form,
  ApplicationTypes,
  Comparators,
  FormModes,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from './messages'

export const ReviewApplication: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Úrvinnsla umsóknar um að gerast skjalaveitandi',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'applicant',
      name: m.reviewSection,
      children: [
        buildMultiField({
          id: 'overview',
          name: 'Umsókn um að gerast skjalaveitandi:',
          children: [
            buildDividerField({ name: 'Upplýsingar um stofnun' }),
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
              disabled: true,
            }),
            buildDividerField({ name: 'Upplýsingar um ábyrgðarmann' }),
            buildTextField({
              id: 'administrativeContact.name',
              name: m.administrativeContactName,
              disabled: true,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: m.administrativeContactEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              disabled: true,
            }),
            buildDividerField({ name: 'Tæknilegur tengiliður' }),
            buildTextField({
              id: 'technicalContact.name',
              name: m.technicalContactName,
              disabled: true,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: m.technicalContactEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: m.technicalContactPhoneNumber,
              disabled: true,
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              name: 'Samþykkir þú þessa umsókn?',
              placement: 'screen',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
                //Add "ófullnægjandi" here
              ],
            }),
            buildTextField({
              id: 'rejectionReason',
              name: 'Ástæða höfnunar',
              condition: {
                questionId: 'approvedByReviewer',
                isMultiCheck: false,
                comparator: Comparators.EQUALS,
                value: 'REJECT',
              },
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
