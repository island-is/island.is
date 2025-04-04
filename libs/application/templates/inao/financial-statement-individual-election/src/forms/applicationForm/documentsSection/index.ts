import {
  buildFileUploadField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { LESS } from '../../../utils/constants'

export const documentsSection = buildSection({
  id: 'documents',
  title: m.financialStatement,
  condition: (answers, _externalData) => {
    const incomeLimit = getValueViaPath(answers, 'election.incomeLimit')
    return incomeLimit !== LESS
  },
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
