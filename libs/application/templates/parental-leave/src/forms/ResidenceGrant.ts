import {
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../constants'
import { parentalLeaveFormMessages } from '../lib/messages'

export const ResidenceGrant: Form = buildForm({
  id: 'residenceGrantApplication',
  title: parentalLeaveFormMessages.residenceGrantMessage.residenceGrantTitle,
  logo: Logo,
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
          ],
        }),
        buildMultiField({
          title:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantAttachmentTitle,
          id: 'residenceGrant.multiTwo',
          description:
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantAttachmentDescription,
          children: [
            buildFileUploadField({
              id: 'fileUpload.residenceGrant',
              title: '',
              maxSize: FILE_SIZE_LIMIT,
              uploadAccept: '.pdf',
              uploadDescription:
                parentalLeaveFormMessages.selfEmployed.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.selfEmployed.attachmentButton,
            }),
            buildSubmitField({
              id: 'residenceGrant.submit',
              placement: 'footer',
              title: parentalLeaveFormMessages.confirmation.title,
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
