import {
  buildDateField,
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
import { actionsResidenceGrant } from '../lib/parentalLeaveUtils'

export const ResidenceGrant: Form = buildForm({
  id: 'residenceGrantApplication',
  title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS, // is this correct mode? or should we skip this?
  children: [
    buildSection({
      id: 'residentGrantApplication',
      title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantApplyTitle,
      children: [
        buildMultiField({
          title: 'DateField',
          id: 'dvalarstyrk',
          description:
            'Add the date form when you wish to apply for Dvalastyrkur',
          space: 2,
          children: [
            buildDateField({
              id: 'dvalarstyrk.dateFrom',
              title: 'From',
              placeholder: '',
              backgroundColor: 'blue',
              width: 'half',
            }),
            buildDateField({
              id: 'dvalarstyrk.dateTo',
              title: 'To',
              placeholder: '',
              backgroundColor: 'blue',
              width: 'half',
            }),
          ],
        }),
        buildFileUploadField({
          id: 'residenceGrantApplication.fileUpload',
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
