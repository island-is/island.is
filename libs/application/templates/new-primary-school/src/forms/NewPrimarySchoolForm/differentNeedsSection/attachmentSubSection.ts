import {
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { differentNeedsMessages } from '../../../lib/messages'
import { shouldShowPage } from '../../../utils/conditionUtils'
import {
  ApplicationFeatureKey,
  AttachmentOptions,
  FILE_SIZE_LIMIT,
  UPLOAD_ACCEPT,
} from '../../../utils/constants'

export const attachmentSubSection = buildSubSection({
  id: 'attachmentSubSection',
  title: differentNeedsMessages.attachments.subSectionTitle,
  // show attachment page only if feature is enabled (only enabled for Special School and
  // Special Department) and application type is not continuing enrollment
  condition: (answers, externalData) =>
    shouldShowPage(answers, externalData, ApplicationFeatureKey.ATTACHMENTS),
  children: [
    buildMultiField({
      id: 'attachments',
      title: differentNeedsMessages.attachments.subSectionTitle,
      description: differentNeedsMessages.attachments.description,
      children: [
        buildRadioField({
          id: 'attachments.answer',
          space: 0,
          options: [
            {
              value: AttachmentOptions.ATTACHMENTS,
              label:
                differentNeedsMessages.attachments.electronicAttachmentOption,
            },
            {
              value: AttachmentOptions.ATTACHMENTS_AND_PHYSICAL,
              label:
                differentNeedsMessages.attachments
                  .electronicAndPaperAttachmentOption,
            },
            {
              value: AttachmentOptions.PHYSICAL,
              label: differentNeedsMessages.attachments.paperAttachmentOption,
            },
          ],
        }),
        buildFileUploadField({
          id: 'attachments.files',
          title: differentNeedsMessages.attachments.subSectionTitle,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText:
            differentNeedsMessages.attachments.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: differentNeedsMessages.attachments.attachmentHeader,
          uploadDescription:
            differentNeedsMessages.attachments.attachmentDescription,
          uploadButtonLabel:
            differentNeedsMessages.attachments.attachmentButton,
          uploadMultiple: true,
          marginTop: 3,
        }),
      ],
    }),
  ],
})
