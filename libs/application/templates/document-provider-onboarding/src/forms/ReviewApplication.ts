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
  name: m.reviewTitle,
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
            buildDividerField({ name: m.applicantTitle }),
            buildTextField({
              id: 'applicant.nationalId',
              name: m.applicantNationalId,
              disabled: true,
            }),
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
              format: '###-####',
              placeholder: '000-0000',
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
            buildDividerField({
              name: m.administrativeContactTitle,
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
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildDividerField({ name: m.technicalContactTitle }),
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
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildDividerField({ name: m.helpDeskTitle }),
            buildTextField({
              id: 'helpDesk.email',
              name: m.helpDeskEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              name: m.helpDeskPhoneNumber,
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
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
              name: m.reviewRejectReasonLabel,
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
