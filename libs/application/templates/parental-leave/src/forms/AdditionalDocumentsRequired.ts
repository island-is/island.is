import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../constants'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'
export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'ParentalLeaveInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: parentalLeaveFormMessages.attachmentScreen.title,
      children: [
        buildCustomField({
          id: 'uploadAdditionalFilesInfoScreen',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          component: 'UploadAdditionalFilesInfoScreen',
        }),
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          children: [
            buildFileUploadField({
              id: 'fileUpload.additionalDocuments',
              title: parentalLeaveFormMessages.attachmentScreen.title,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.description,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
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
                  event: 'APPROVE',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'unused',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
