import {
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildDescriptionField,
  buildTextField,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  ApplicationTypes,
  Comparators,
  FormModes,
} from '@island.is/application/types'
import { m } from './messages'

export const ReviewApplication: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: m.reviewTitle,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'applicant',
      title: m.reviewSection,
      children: [
        buildMultiField({
          id: 'review',
          title: m.reviewTitle,
          children: [
            //Error in dev tools, missing keys on divider fields...
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
            //Error in dev tools, missing keys on divider fields...
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
            //Error in dev tools, missing keys on divider fields...
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
            //Error in dev tools, missing keys on divider fields...
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
            //Error in dev tools, missing keys on radio controller...
            buildSubmitField({
              id: 'approvedByReviewer',
              title: m.reviewQuestion,
              placement: 'screen',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
                //TODO Add "ófullnægjandi" here
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
