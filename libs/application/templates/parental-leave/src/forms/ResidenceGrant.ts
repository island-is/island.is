import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../constants'
import {
  parentalLeaveFormMessages,
} from '../lib/messages'

export const ResidenceGrant: Form = buildForm({
  id: 'ParentalLeaveResidenceGrant',
  title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS, // is this correct mode? or should we skip this?
  children: [
    buildSection({
      id: 'residentGrantApplication',
      title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantApplyTitle,
      children: [
        buildDescriptionField({
          id: 'residenceGrantApplication.information',
          title: 'Hvað á að vera hér',
          description: 'upplýsingar '
        }),
        buildFileUploadField({
          id: 'residenceGrantApplication.fileUpload',
          title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantAttachmentTitle,
          introduction: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantAttachmentDescription,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: '',
          uploadAccept: '.pdf',
          uploadHeader: '',
          uploadDescription: '',
          uploadButtonLabel:
            parentalLeaveFormMessages.selfEmployed.attachmentButton,
        }),
        // buildCustomField({
        //   id: 'residenceGrantApplication',
        //   defaultValue: 'submit',
        //   title: '',
        //   description: '',
        //   component: 'ResidenceGrantApplication',
        // }),
        buildSubmitField({
          id: 'residenceGrantApplication.submit',
          placement: 'footer',
          title: parentalLeaveFormMessages.confirmation.title,
          actions: [
            {
              event: 'ABORT',
              name: parentalLeaveFormMessages.confirmation.cancel,
              type: 'reject',
            },
            {
              event: 'SUBMIT',
              name: parentalLeaveFormMessages.confirmation.title,
              type: 'primary',
            },
          ],
        }),
        buildCustomField({ 
          id: 'residenceGrantApplication.thankYou',
          title: parentalLeaveFormMessages.finalScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
