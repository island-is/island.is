import {
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import WomanWithLaptopIllustration from '../assets/Images/WomanWithLaptopIllustration'
import WomanWithPhoneIllustration from '../assets/Images/WomanWithPhoneIllustration'
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
            buildImageField({
              id: 'imagefield.submit',
              title: '',
              image: WomanWithPhoneIllustration,
              imageWidth: 'auto',
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
          uploadDescription:
            parentalLeaveFormMessages.selfEmployed.uploadDescription,
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
            buildImageField({
              id: 'residenceGrantApplicationNoBirthDate.image',
              title: '',
              image: WomanWithLaptopIllustration,
              imageWidth: 'auto',
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
