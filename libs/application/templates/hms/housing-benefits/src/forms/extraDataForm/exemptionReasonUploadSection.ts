import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { UPLOAD_ACCEPT } from '../../utils/constants'
import { institutionRequestedExemptionReason } from '../../utils/extraDataFormConditions'

export const extraDataExemptionReasonUploadSection = buildSection({
  condition: institutionRequestedExemptionReason,
  id: 'extraDataExemptionSection',
  title: m.extraDataMessages.exemptionUploadTitle,
  children: [
    buildMultiField({
      id: 'extraDataExemptionMultiField',
      title: m.extraDataMessages.exemptionUploadTitle,
      description: m.extraDataMessages.exemptionUploadDescription,
      children: [
        buildFileUploadField({
          id: 'extraDataAttachments.exemptionReason',
          title: m.extraDataMessages.documentExemptionReason,
          uploadAccept: UPLOAD_ACCEPT,
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
