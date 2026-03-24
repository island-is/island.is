import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { institutionRequestedExemptionReason } from '../../utils/extraDataFormConditions'

export const extraDataExemptionReasonUploadSection = buildSection({
  condition: institutionRequestedExemptionReason,
  id: 'extraDataExemptionSection',
  title: m.extraDataMessages.exemptionUploadTitle,
  children: [
    buildMultiField({
      id: 'extraDataExemptionMultiField',
      title: m.extraDataMessages.exemptionUploadTitle,
      children: [
        buildDescriptionField({
          id: 'extraDataExemptionDescription',
          description: m.extraDataMessages.exemptionUploadDescription,
          marginBottom: 4,
        }),
        buildFileUploadField({
          id: 'extraDataAttachments.exemptionReason',
          title: m.extraDataMessages.documentExemptionReason,
          uploadAccept: '.pdf,.doc,.docx',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
