import {
  buildCustomField,
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
          title:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantApplyHeader,
          id: 'residenceGrant.multiOne',
          description:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantPeriodDescriptionLineOne,
          space: 2,
          children: [
            buildDescriptionField({
              id: 'residenceGrant.description',
              title: '',
              description:
                parentalLeaveFormMessages.residenceGrantMessage
                  .residenceGrantPeriodDescriptionLineTwo,
            }),
            buildCustomField({
              id: 'imagefield.submit',
              title: '',
              defaultValue: 2,
              component: 'ImageField',
            }),
          ],
        }),
        buildFileUploadField({
          id: 'fileUpload.residenceGrant',
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
        buildMultiField({
          title: parentalLeaveFormMessages.confirmation.title,
          id: 'residenceGrant.multiTwo',
          description:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantSelectPeriodSubmitDescription,
          children: [
            buildSubmitField({
              id: 'residenceGrant.submit',
              placement: 'footer',
              title: parentalLeaveFormMessages.confirmation.title,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'REJECT',
                  name: parentalLeaveFormMessages.residenceGrantMessage
                    .residenceGrantReject,
                  type: 'reject',
                },
                {
                  event: 'APPROVE',
                  name: parentalLeaveFormMessages.residenceGrantMessage
                    .residenceGrantSubmit,
                  type: 'primary',
                },
              ],
            }),
            buildCustomField({
              id: 'imagefield.submit',
              title: '',
              defaultValue: 1,
              component: 'ImageField',
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
