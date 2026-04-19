import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'
import {
  isInstitutionApproved,
  isInstitutionRejected,
  isInstitutionRequestingExtraData,
} from '../../utils/institutionReviewConditions'

export const institutionForm = buildForm({
  id: 'institutionForm',
  mode: FormModes.IN_PROGRESS,
  logo: HmsLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'institutionReviewSection',
      title: m.institutionMessages.sectionTitle,
      children: [
        buildMultiField({
          id: 'institutionReviewMultiField',
          title: m.institutionMessages.sectionTitle,
          children: [
            buildDescriptionField({
              id: 'institutionReviewDescription1',
              description: m.institutionMessages.description1,
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'institutionReviewDescription2',
              description: m.institutionMessages.description2,
              marginBottom: 4,
            }),
            buildRadioField({
              id: 'approveOrReject',
              clearOnChange: [
                'approveOrRejectReason',
                'institutionRequestedDocuments',
                'institutionMessageToApplicant',
              ],
              options: [
                {
                  label: m.institutionMessages.approveOption,
                  value: 'approve',
                },
                {
                  label: m.institutionMessages.rejectOption,
                  value: 'reject',
                },
                {
                  label: m.institutionMessages.requestExtraDataOption,
                  value: 'requestExtraData',
                },
              ],
            }),
            buildDescriptionField({
              condition: isInstitutionRejected,
              id: 'approveOrRejectRejectionIntro',
              title: m.institutionMessages.rejectionTitle,
              titleVariant: 'h4',
              description: m.institutionMessages.rejectionDescription,
            }),
            buildTextField({
              condition: isInstitutionRejected,
              id: 'approveOrRejectReason',
              title: m.institutionMessages.rejectionReasonLabel,
              placeholder: m.institutionMessages.rejectionReasonPlaceholder,
              rows: 5,
              maxLength: 1000,
              variant: 'textarea',
            }),
            buildAlertMessageField({
              condition: isInstitutionRejected,
              id: 'approveOrRejectRejectionAlert',
              alertType: 'warning',
              title: m.institutionMessages.rejectionWarningTitle,
              message: m.institutionMessages.rejectionWarningMessage,
            }),
            buildDescriptionField({
              condition: isInstitutionRequestingExtraData,
              id: 'requestExtraDataIntro',
              title: m.institutionMessages.requestExtraDataTitle,
              titleVariant: 'h4',
              description: m.institutionMessages.requestExtraDataDescription,
              marginBottom: 2,
            }),
            buildCheckboxField({
              condition: isInstitutionRequestingExtraData,
              id: 'institutionRequestedDocuments',
              title: m.institutionMessages.requestExtraDataDocumentsLabel,
              options: [
                {
                  label: m.extraDataMessages.documentExemptionReason,
                  value: 'exemptionReason',
                },
                {
                  label: m.extraDataMessages.documentCustodyAgreement,
                  value: 'custodyAgreement',
                },
                {
                  label: m.extraDataMessages.documentChangedCircumstances,
                  value: 'changedCircumstances',
                },
              ],
            }),
            buildTextField({
              condition: isInstitutionRequestingExtraData,
              id: 'institutionMessageToApplicant',
              title: m.institutionMessages.requestExtraDataMessageLabel,
              placeholder:
                m.institutionMessages.requestExtraDataMessagePlaceholder,
              rows: 6,
              maxLength: 4000,
              variant: 'textarea',
            }),
            buildSubmitField({
              condition: isInstitutionApproved,
              id: 'institutionApproveApplication',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'APPROVE',
                  name: m.institutionMessages.approveButton,
                  type: 'primary',
                },
              ],
            }),
            buildSubmitField({
              condition: isInstitutionRejected,
              id: 'institutionRejectApplication',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'REJECT',
                  name: m.institutionMessages.rejectButton,
                  type: 'reject',
                },
              ],
            }),
            buildSubmitField({
              condition: isInstitutionRequestingExtraData,
              id: 'institutionRequestExtraData',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'EDIT',
                  name: m.institutionMessages.requestExtraDataButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
