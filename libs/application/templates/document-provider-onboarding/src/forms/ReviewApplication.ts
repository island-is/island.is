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
          id: 'review',
          name: m.reviewTitle,
          description: m.reviewSubTitle,
          children: [
            buildDividerField({ name: m.applicantTitle.defaultMessage }),
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
              disabled: true,
              width: 'half',
            }),
            buildDividerField({
              name: m.administrativeContactTitle.defaultMessage,
            }),
            buildTextField({
              id: 'administrativeContact.name',
              name: m.administrativeContactName,
              disabled: true,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: m.administrativeContactEmail,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              disabled: true,
              width: 'half',
            }),
            buildDividerField({ name: m.technicalContactTitle.defaultMessage }),
            buildTextField({
              id: 'technicalContact.name',
              name: m.technicalContactName,
              disabled: true,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: m.technicalContactEmail,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: m.technicalContactPhoneNumber,
              disabled: true,
              width: 'half',
            }),
            buildDividerField({ name: m.helpDeskTitle.defaultMessage }),
            buildTextField({
              id: 'helpDesk.email',
              name: m.helpDeskEmail,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              name: m.helpDeskPhoneNumber,
              disabled: true,
              width: 'half',
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              name: m.reviewQuestion,
              placement: 'screen',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
                //TODO Add "ófullnægjandi" here
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
          id: 'reviewProcessed',
          name: m.reviewProcessedTitle,

          introduction: m.reviewProcessedIntroduction,
        }),
      ],
    }),
  ],
})
