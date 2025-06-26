import {
  buildAlertMessageField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { AttachmentItem } from '@island.is/application/types'

export const photoSection = buildSection({
  id: 'photoSection',
  title: m.photoMessages.title,
  children: [
    buildMultiField({
      id: 'photoMultiField',
      title: m.photoMessages.title,
      description: m.photoMessages.description,
      children: [
        buildAlertMessageField({
          condition: (answers) => {
            const photos = getValueViaPath<Array<AttachmentItem>>(
              answers,
              'photos',
            )

            if (!photos || photos.length === 0) {
              return false
            }

            return photos.length < 3
          },
          id: 'photoAlertMessage',
          title: m.photoMessages.alertMessageTitle,
          message: m.photoMessages.alertMessage,
          alertType: 'warning',
        }),
        buildFileUploadField({
          id: 'photos',
          uploadMultiple: true,
          maxSize: 100000000,
          totalMaxSize: 10000000000,
        }),
      ],
    }),
  ],
})
