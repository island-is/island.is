import {
  buildCustomField,
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
  id: Routes.MISSINGFILESSPOUSE,
  title: m.missingFiles.general.pageTitle,
  children: [
    buildMultiField({
      id: Routes.MISSINGFILESSPOUSE,
      title: m.missingFiles.general.pageTitle,
      description: m.missingFiles.general.description,
      children: [
        buildCustomField(
          {
            id: Routes.MISSINGFILES,
            title: m.missingFiles.general.pageTitle,
            component: 'MissingFiles',
          },
          { isSpouse: true },
        ),
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
