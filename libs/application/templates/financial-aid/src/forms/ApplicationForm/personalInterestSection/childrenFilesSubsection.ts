import {
  buildCustomField,
  buildFileUploadField,
} from '@island.is/application/core'
import { buildSubSection } from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../../lib/constants'
import { hasChildren, isRVKresident } from '../../../utils/conditions'
import * as m from '../../../lib/messages'

export const childrenFilesSubsection = buildSubSection({
  condition: hasChildren,
  id: Routes.CHILDRENFILES,
  title: m.childrenFilesForm.general.sectionTitle,
  children: [
    buildCustomField({
      condition: (_answers, externalData) =>
        !isRVKresident(_answers, externalData),
      id: Routes.CHILDRENFILES,
      title: m.childrenFilesForm.general.pageTitle,
      component: 'ChildrenFilesForm',
    }),
    buildFileUploadField({
      marginTop: 8,
      condition: isRVKresident,
      id: Routes.RVKCHILDRENFILES,
      title: m.childrenFilesForm.general.pageTitle,
      uploadAccept: UPLOAD_ACCEPT.join(','),
      maxSize: FILE_SIZE_LIMIT,
      maxSizeErrorText: m.filesText.sizeErrorMessage,
      uploadHeader: m.filesText.header,
      uploadDescription: m.childrenFilesForm.general.description,
      uploadButtonLabel: m.filesText.buttonLabel,
      uploadMultiple: true,
    }),
  ],
})
