import {
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { FILE_SIZE_LIMIT } from '../constants'
import { parentalLeaveFormMessages } from '../lib/messages'

export const ResidenceGrant: Form = buildForm({
  id: 'residenceGrantApplication',
  title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantTitle,
  logo: DirectorateOfLabourLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'residenceGrant',
      title:
        parentalLeaveFormMessages.residenceGrantMessage
          .residenceGrantApplyTitle,
      children: [
        buildMultiField({
          title:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantAttachmentTitle,
          id: 'residenceGrant.multi',
          description:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantAttachmentDescription,
          children: [
            buildFileUploadField({
              id: 'fileUpload.residenceGrant',
              maxSize: FILE_SIZE_LIMIT,
              uploadAccept: '.pdf',
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildSubmitField({
              id: 'residenceGrant.submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: parentalLeaveFormMessages.confirmation.cancel,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: parentalLeaveFormMessages.residenceGrantMessage
                    .residenceGrantSubmit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
