import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { institutionRequestedCustodyAgreement } from '../../utils/extraDataFormConditions'

export const extraDataCustodyAgreementUploadSection = buildSection({
  condition: institutionRequestedCustodyAgreement,
  id: 'extraDataCustodySection',
  title: m.extraDataMessages.custodyUploadTitle,
  children: [
    buildMultiField({
      id: 'extraDataCustodyMultiField',
      title: m.extraDataMessages.custodyUploadTitle,
      description: m.extraDataMessages.custodyUploadDescription,
      children: [
        buildFileUploadField({
          id: 'extraDataAttachments.custodyAgreement',
          title: m.extraDataMessages.documentCustodyAgreement,
          uploadAccept: '.pdf,.doc,.docx',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
