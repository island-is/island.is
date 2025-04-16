import { buildFileUploadField, buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { isGreaterThanIncomeLimit } from '../../../utils/conditions'

export const documentsSection = buildSection({
  id: 'documents',
  title: m.financialStatement,
  condition: isGreaterThanIncomeLimit,
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
