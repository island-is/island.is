import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { ApproveOptions } from '../../lib/types'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../lib/constants'
import * as m from '../../lib/messages'

export const spouseIncomeFilesSection = buildSection({
  condition: (answers) => answers.spouseIncome === ApproveOptions.Yes,
  id: Routes.SPOUSEINCOMEFILES,
  title: m.incomeFilesForm.general.sectionTitle,
  children: [
    buildMultiField({
      title: m.incomeFilesForm.general.pageTitle,
      description: m.incomeFilesForm.general.description,
      children: [
        buildFileUploadField({
          id: Routes.SPOUSEINCOMEFILES,
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
        }),
      ],
    }),
  ],
})
