import {
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import {
  AttachmentOptions,
  FILE_SIZE_LIMIT,
  UPLOAD_ACCEPT,
} from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { canHaveAttachments } from '../../../utils/conditionUtils'

export const attachmentSubSection = buildSubSection({
  id: 'attachmentSubSection',
  title: newPrimarySchoolMessages.differentNeeds.attachmentsSubSectionTitle,
  // show attachment page only if feature is enabled (only enabled for Special School and
  // Special Department) and application type is not continuing enrollment
  condition: (answer, externalData) => canHaveAttachments(answer, externalData),
  children: [
    buildMultiField({
      id: 'attachments',
      title: newPrimarySchoolMessages.differentNeeds.attachmentsSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds
          .attachmentsSubSectionDescription,
      children: [
        buildRadioField({
          id: 'attachments.answer',
          space: 0,
          options: [
            {
              value: AttachmentOptions.ATTACHMENTS,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .electronicAttachmentOption,
            },
            {
              value: AttachmentOptions.PHYSICAL,
              label:
                newPrimarySchoolMessages.differentNeeds.paperAttachmentOption,
            },
            {
              value: AttachmentOptions.ATTACHMENTS_AND_PHYSICAL,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .electronicAndPaperAttachmentOption,
            },
          ],
        }),
        buildFileUploadField({
          id: 'attachments.files',
          title:
            newPrimarySchoolMessages.differentNeeds.attachmentsSubSectionTitle,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText:
            newPrimarySchoolMessages.differentNeeds.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader:
            newPrimarySchoolMessages.differentNeeds.attachmentHeader,
          uploadDescription:
            newPrimarySchoolMessages.differentNeeds.attachmentDescription,
          uploadButtonLabel:
            newPrimarySchoolMessages.differentNeeds.attachmentButton,
          uploadMultiple: true,
          marginTop: 3,
        }),
      ],
    }),
  ],
})
