import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../lib/constants'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../lib/messages'

export const MissingFiles = buildSection({
  id: Routes.MISSINGFILES,
  title: m.missingFiles.general.pageTitle,
  children: [
    buildMultiField({
      id: Routes.MISSINGFILES,
      title: m.missingFiles.general.pageTitle,
      description: m.missingFiles.general.description,
      children: [
        buildFileUploadField({
          id: `${Routes.MISSINGFILES}`,
          title: m.missingFiles.general.pageTitle,
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
        }),
        buildDescriptionField({
          id: `${Routes.MISSINGFILES}.description`,
          title: m.missingFiles.comment.title,
          marginTop: 4,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'fileUploadComment',
          title: m.missingFiles.comment.inputTitle,
          placeholder: m.missingFiles.comment.inputPlaceholder,
          variant: 'textarea',
          rows: 6,
        }),
        buildSubmitField({
          id: 'missingFilesSubmit',
          title: '',
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: m.missingFiles.general.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
