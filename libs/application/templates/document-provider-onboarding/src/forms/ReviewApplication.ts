import {
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildDescriptionField,
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
  title: m.reviewTitle,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'applicant',
      title: m.reviewSection,
      children: [
        buildMultiField({
          id: 'review',
          title: m.reviewTitle,
          children: [
            buildDividerField({ title: m.applicantTitle }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.applicantNationalId,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.applicantName,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.applicantEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: m.applicantPhoneNumber,
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.applicantAddress,
              disabled: true,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              title: m.applicantZipCode,
              disabled: true,
            }),
            buildDividerField({
              title: m.administrativeContactTitle,
            }),
            buildTextField({
              id: 'administrativeContact.name',
              title: m.administrativeContactName,
              disabled: true,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              title: m.administrativeContactEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              title: m.administrativeContactPhoneNumber,
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildDividerField({ title: m.technicalContactTitle }),
            buildTextField({
              id: 'technicalContact.name',
              title: m.technicalContactName,
              disabled: true,
            }),
            buildTextField({
              id: 'technicalContact.email',
              title: m.technicalContactEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              title: m.technicalContactPhoneNumber,
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildDividerField({ title: m.helpDeskTitle }),
            buildTextField({
              id: 'helpDesk.email',
              title: m.helpDeskEmail,
              disabled: true,
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              title: m.helpDeskPhoneNumber,
              disabled: true,
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              title: m.reviewQuestion,
              placement: 'screen',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
            }),
            buildTextField({
              id: 'rejectionReason',
              title: m.reviewRejectReasonLabel,
              condition: {
                questionId: 'approvedByReviewer',
                isMultiCheck: false,
                comparator: Comparators.EQUALS,
                value: 'REJECT',
              },
            }),
          ],
        }),
        buildDescriptionField({
          id: 'reviewProcessed',
          title: m.reviewProcessedTitle,
          description: m.reviewProcessedIntroduction,
        }),
      ],
    }),
  ],
})
