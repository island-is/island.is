import {
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../constants'
import { parentalLeaveFormMessages } from '../lib/messages'
import { actionsResidenceGrant } from '../lib/parentalLeaveUtils'

export const ResidenceGrant: Form = buildForm({
  id: 'residenceGrantApplication',
  title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'residenceGrant',
      title:
        parentalLeaveFormMessages.residenceGrantMessage
          .residenceGrantApplyTitle,
      children: [
        buildMultiField({
          title: 'DateField',
          id: 'residenceGrant',
          description:
            'Add the date form when you wish to apply for Dvalastyrkur',
          space: 2,
          children: [
            buildDateField({
              id: 'residenceGrant.dateFrom',
              title: 'From',
              placeholder: '',
              backgroundColor: 'blue',
              width: 'half',
            }),
            buildDateField({
              id: 'residenceGrant.dateTo',
              title: 'To',
              placeholder: '',
              backgroundColor: 'blue',
              width: 'half',
            }),
          ],
        }),
        buildFileUploadField({
          id: 'residenceGrantApplication.fileUpload',
          condition: (answers) => {
            console.log(answers)
            return true
          },
          title:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantAttachmentTitle,
          introduction:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantAttachmentDescription,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: '',
          uploadAccept: '.pdf',
          uploadHeader: '',
          uploadDescription: '',
          uploadButtonLabel:
            parentalLeaveFormMessages.selfEmployed.attachmentButton,
        }),
        buildSubmitField({
          id: 'residenceGrantApplication.submit',
          placement: 'footer',
          title: parentalLeaveFormMessages.confirmation.title,
          refetchApplicationAfterSubmit: true,
          actions: actionsResidenceGrant('reject', [
            {
              event: 'APPROVE',
              name: parentalLeaveFormMessages.confirmation.title,
              type: 'primary',
            },
          ]),
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
