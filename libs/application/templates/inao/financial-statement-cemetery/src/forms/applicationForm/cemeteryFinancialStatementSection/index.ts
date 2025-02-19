import { buildFileUploadField, buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { isCemetryUnderFinancialLimit } from '../../../utils/helpers'

// This section should appear if the cemetries total income is over the income limit
export const cemeteryFinancialStatementSection = buildSection({
  condition: (answers) => {
    return !isCemetryUnderFinancialLimit(answers)
  },
  id: 'documents',
  title: m.financialStatement,
  children: [
    buildFileUploadField({
      id: 'attachments.file',
      title: m.upload,
      introduction: m.uploadIntro,
      description: m.uploadDescription,
      uploadHeader: m.uploadHeader,
      uploadAccept: '.pdf',
      uploadDescription: m.uploadAccept,
      uploadButtonLabel: m.uploadButtonLabel,
      uploadMultiple: false,
      forImageUpload: false,
    }),
  ],
})
