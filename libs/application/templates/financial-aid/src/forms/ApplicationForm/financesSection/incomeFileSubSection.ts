import {
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { ApproveOptions } from '../../../lib/types'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const incomeFilesSubSection = buildSubSection({
  condition: (answers) => {
    const income = getValueViaPath<ApproveOptions>(answers, 'income.type')

    return income === ApproveOptions.Yes
  },
  id: Routes.INCOMEFILES,
  title: m.incomeFilesForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.INCOMEFILES,
      title: m.incomeFilesForm.general.pageTitle,
      description: m.incomeFilesForm.general.descriptionTaxSuccess,
      children: [
        buildFileUploadField({
          id: Routes.INCOMEFILES,
          title: '',
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
        }),
      ],
    }),
  ],
})
