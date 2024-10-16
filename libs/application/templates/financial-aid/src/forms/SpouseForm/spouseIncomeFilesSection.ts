import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { ApproveOptions } from '../../lib/types'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../lib/constants'
import * as m from '../../lib/messages'

export const spouseIncomeFilesSection = buildSection({
  condition: (answers) => {
    const income = getValueViaPath<ApproveOptions>(answers, 'spouseIncome.type')
    return income === ApproveOptions.Yes
  },
  id: Routes.SPOUSEINCOMEFILES,
  title: m.incomeFilesForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSEINCOMEFILES,
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
