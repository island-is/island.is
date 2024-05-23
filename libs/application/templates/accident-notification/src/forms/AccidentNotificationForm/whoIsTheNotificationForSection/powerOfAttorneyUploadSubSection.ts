import {
  buildCustomField,
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { error, powerOfAttorney } from '../../../lib/messages'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../constants'
import { isUploadNow } from '../../../utils/isUploadNow'

export const powerOfAttorneyUploadSubSection = buildSubSection({
  id: 'powerOfAttorney.upload.section',
  title: powerOfAttorney.upload.sectionTitle,
  children: [
    buildMultiField({
      id: 'powerOfAttorney',
      title: powerOfAttorney.upload.heading,
      description: powerOfAttorney.upload.description,
      children: [
        buildCustomField({
          id: 'attachments.powerOfAttorney.fileLink',
          component: 'ProxyDocument',
          doesNotRequireAnswer: true,
          title: '',
        }),
        buildFileUploadField({
          id: 'attachments.powerOfAttorneyFile.file',
          title: '',
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: error.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: powerOfAttorney.upload.uploadHeader,
          uploadDescription: powerOfAttorney.upload.uploadDescription,
          uploadButtonLabel: powerOfAttorney.upload.uploadButtonLabel,
        }),
      ],
    }),
  ],
  condition: (formValue) => isUploadNow(formValue),
})
