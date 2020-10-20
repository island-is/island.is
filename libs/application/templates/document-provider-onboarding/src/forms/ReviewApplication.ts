import {
  buildDividerField,
  buildReviewField,
  buildForm,
  buildMultiField,
  buildSection,
  buildIntroductionField,
  buildTextField,
  Form,
  ApplicationTypes,
  Comparators,
} from '@island.is/application/core'
import { m } from './messages'

export const ReviewApplication: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  ownerId: 'TODO?',
  name: 'Úrvinnsla umsóknar um að gerast skjalaveitandi',
  mode: 'review',
  children: [
    buildSection({
      id: 'applicant',
      name: m.reviewSection,
      children: [
        buildMultiField({
          id: 'overview',
          name: 'Umsókn um að gerast skjalaveitandi:',
          children: [
            buildDividerField({ name: 'Umsækjandi' }),
            buildTextField({
              id: 'applicant.name',
              name: 'Nafn umsækjanda',
              disabled: true,
            }),
            buildReviewField({
              id: 'approvedByReviewer',
              name: 'Samþykkir þú þessa umsókn?',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
            }),
            buildTextField({
              id: 'rejectionReason', // this is not working atm, probably since it's on the last page
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
