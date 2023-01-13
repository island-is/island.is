import {
    buildFileUploadField,
    buildForm,
    buildSection,
    buildSubmitField,
  } from '@island.is/application/core'
  import { Form } from '@island.is/application/types'
  
  import Logo from '../assets/Logo'
  import { FILE_SIZE_LIMIT } from '../constants'
  import {
    parentalLeaveFormMessages,
  } from '../lib/messages'
  
  export const UploadAdditionalFiles: Form = buildForm({
    id: 'ParentalLeaveUploadAdditionalFiles',
    title: '',
    logo: Logo,
    children: [
      buildSection({
        id: 'additionalDocuments',
        title: '',
        children: [
          buildFileUploadField({
            id: 'fileUpload.additionalDocuments',
            title: parentalLeaveFormMessages.attachmentScreen.genericTitle,
            introduction:
              parentalLeaveFormMessages.attachmentScreen.genericDescription,
            maxSize: FILE_SIZE_LIMIT,
            maxSizeErrorText:
              parentalLeaveFormMessages.selfEmployed.attachmentMaxSizeError,
            uploadAccept: '.pdf',
            uploadHeader: '',
            uploadDescription: '',
            uploadButtonLabel:
              parentalLeaveFormMessages.selfEmployed.attachmentButton,
          }),
          buildSubmitField({
            id: 'additionalDocuments',
            title: parentalLeaveFormMessages.confirmation.title,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: parentalLeaveFormMessages.attachmentScreen.additionalDocumentsEditSubmit,
                type: 'primary',
              },
            ],
          }),
        ],
      }),
    ],
  })