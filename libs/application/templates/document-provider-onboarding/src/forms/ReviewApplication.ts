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
              name: 'Nafn stofnunar',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.email',
              name: 'Netfang ',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: 'Símanúmer',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.address',
              name: 'Heimilisfang',
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: 'Póstnúmer og staður',
              disabled: true,
            }),
            buildDividerField({ name: 'Upplýsingar um ábyrgðarmann' }),
            buildTextField({
              id: 'administrativeContact.name',
              name: 'Nafn ábyrgðarmanns',
              disabled: true,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: 'Netfang',
              disabled: true,
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: 'Símanúmer',
              disabled: true,
            }),
            buildDividerField({ name: 'Tæknilegur tengiliður' }),
            buildTextField({
              id: 'technicalContact.name',
              name: 'Nafn',
              disabled: true,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: 'Netfang',
              disabled: true,
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: 'Símanúmer',
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
