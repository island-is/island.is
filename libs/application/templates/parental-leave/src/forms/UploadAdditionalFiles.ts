import {
    buildCustomField,
    buildFileUploadField,
    buildForm,
    buildSection,
  } from '@island.is/application/core'
  import { Form } from '@island.is/application/types'
  
  import Logo from '../assets/Logo'
  import { FILE_SIZE_LIMIT, States } from '../constants'
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
        title: (application) =>
          application.state === States.VINNUMALASTOFNUN_APPROVAL
            ? parentalLeaveFormMessages.reviewScreen.titleReceived
            : application.state === States.APPROVED
            ? parentalLeaveFormMessages.reviewScreen.titleApproved
            : parentalLeaveFormMessages.reviewScreen.titleInReview,
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
        ],
      }),
    ],
  })