import {
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { FILE_SIZE_LIMIT } from '../constants'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'ParentalLeaveInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: DirectorateOfLabourLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: parentalLeaveFormMessages.attachmentScreen.title,
      children: [
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          description: parentalLeaveFormMessages.attachmentScreen.description,
          children: [
            buildFileUploadField({
              id: 'fileUpload.additionalDocuments',
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .additionalDocumentsEditSubmit,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: parentalLeaveFormMessages.attachmentScreen
                    .additionalDocumentsEditSubmit,
                  type: 'primary',
                  event: DefaultEvents.APPROVE,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
