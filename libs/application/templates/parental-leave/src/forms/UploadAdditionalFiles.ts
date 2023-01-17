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
import { parentalLeaveFormMessages } from '../lib/messages'

export const UploadAdditionalFiles: Form = buildForm({
  id: 'ParentalLeaveUploadAdditionalFiles',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'additionalDocuments',
      title: parentalLeaveFormMessages.confirmation.title,
      children: [
        buildCustomField({
          id: 'periodSynchronizationScreen',
          title: parentalLeaveFormMessages.confirmation.title,
          component: 'PeriodSynchronization',
        }),
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title: parentalLeaveFormMessages.confirmation.title,
          description: parentalLeaveFormMessages.confirmation.description,
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
              id: 'additionalDocumentsSubmit',
              title: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: 'Submit',
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
