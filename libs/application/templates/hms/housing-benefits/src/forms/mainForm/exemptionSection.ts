import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildCheckboxField,
  buildRadioField,
} from '@island.is/application/core'
import { doesAddressMatchRentalContract } from '../../utils/rentalAgreementUtils'
import * as m from '../../lib/messages'
import { isExemptionReason, isExemptionRequested } from '../../utils/utils'

export const exemptionSection = buildSection({
  condition: (answers, externalData) =>
    !doesAddressMatchRentalContract(answers, externalData),
  id: 'exemptionSection',
  title: m.draftMessages.exemptionSection.title,
  children: [
    buildMultiField({
      id: 'exemptionMultiField',
      title: m.draftMessages.exemptionSection.multiFieldTitle,
      children: [
        buildAlertMessageField({
          id: 'exemptionAlert',
          title: m.draftMessages.exemptionSection.alertTitle,
          message: m.draftMessages.exemptionSection.description,
          alertType: 'warning',
        }),
        buildDescriptionField({
          id: 'exemptionDescription',
          description: m.draftMessages.exemptionSection.description2,
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: 'exemptionCheckbox',
          options: [
            {
              value: 'yes',
              label: m.draftMessages.exemptionSection.checkboxLabel,
            },
          ],
          marginBottom: 4,
        }),
        buildRadioField({
          condition: isExemptionRequested,
          id: 'exemptionReason',
          title: m.draftMessages.exemptionSection.checkboxTitle,
          marginBottom: 4,
          options: [
            {
              value: 'studies',
              label: m.draftMessages.exemptionSection.checkboxLabelStudies,
            },
            {
              value: 'health',
              label: m.draftMessages.exemptionSection.checkboxLabelHealth,
            },
            {
              value: 'housing',
              label: m.draftMessages.exemptionSection.checkboxLabelHousing,
            },
            {
              value: 'work',
              label: m.draftMessages.exemptionSection.checkboxLabelWork,
            },
          ],
        }),
        buildFileUploadField({
          condition: (answers) => isExemptionReason(answers, 'studies'),
          id: 'exemptionDocuments.studies',
          title: m.draftMessages.exemptionSection.fileUploadStudiesTitle,
          uploadAccept: '.pdf,.doc,.docx',
        }),
        buildFileUploadField({
          condition: (answers) => isExemptionReason(answers, 'health'),
          id: 'exemptionDocuments.health',
          title: m.draftMessages.exemptionSection.fileUploadHealthTitle,
          uploadAccept: '.pdf,.doc,.docx',
        }),
        buildFileUploadField({
          condition: (answers) => isExemptionReason(answers, 'housing'),
          id: 'exemptionDocuments.housing',
          title: m.draftMessages.exemptionSection.fileUploadHousingTitle,
          uploadAccept: '.pdf,.doc,.docx',
        }),
        buildFileUploadField({
          condition: (answers) => isExemptionReason(answers, 'work'),
          id: 'exemptionDocuments.work',
          title: m.draftMessages.exemptionSection.fileUploadWorkTitle,
          uploadAccept: '.pdf,.doc,.docx',
        }),
      ],
    }),
  ],
})
