import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormValue } from '@island.is/application/types'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../utils/constants'
import { addDocuments, error } from '../../lib/messages'
import {
  hasReceivedInjuryCertificate,
  hasReceivedPoliceReport,
  hasReceivedProxyDocument,
  isFatalAccident,
  isPowerOfAttorney,
  isReportingOnBehalfOfInjured,
  isUniqueAssignee,
} from '../../utils'

export const addAttachmentsSection = (isAssignee?: boolean) =>
  buildSection({
    id: 'addAttachmentSection',
    title: addDocuments.general.heading,
    children: [
      buildMultiField({
        id: 'addAttachmentScreen',
        title: addDocuments.general.heading,
        description: addDocuments.general.description,
        children: [
          buildDescriptionField({
            id: 'attachments.injuryCertificateFile.title',
            title: addDocuments.injuryCertificate.title,
            description: '',
            space: 5,
            titleVariant: 'h5',
            condition: (formValue: FormValue) =>
              !hasReceivedInjuryCertificate(formValue),
          }),
          buildFileUploadField({
            id: 'attachments.injuryCertificateFile.file',
            title: '',
            maxSize: FILE_SIZE_LIMIT,
            maxSizeErrorText: error.attachmentMaxSizeError,
            uploadAccept: UPLOAD_ACCEPT,
            uploadHeader: addDocuments.injuryCertificate.uploadHeader,
            uploadDescription: addDocuments.general.uploadDescription,
            uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            condition: (formValue: FormValue) =>
              !hasReceivedInjuryCertificate(formValue),
          }),
          buildDescriptionField({
            id: 'attachments.powerOfAttorney.title',
            title: addDocuments.powerOfAttorney.title,
            description: '',
            space: 5,
            titleVariant: 'h5',
            condition: (formValue: FormValue) =>
              isPowerOfAttorney(formValue) &&
              !isUniqueAssignee(formValue, !!isAssignee) &&
              !hasReceivedProxyDocument(formValue),
          }),
          buildCustomField({
            id: 'attachments.powerOfAttorney.fileLink',
            component: 'ProxyDocument',
            title: '',
            condition: (formValue: FormValue) =>
              isPowerOfAttorney(formValue) &&
              !isUniqueAssignee(formValue, !!isAssignee) &&
              !hasReceivedProxyDocument(formValue),
          }),
          buildFileUploadField({
            id: 'attachments.powerOfAttorneyFile.file',
            title: '',
            maxSize: FILE_SIZE_LIMIT,
            maxSizeErrorText: error.attachmentMaxSizeError,
            uploadAccept: UPLOAD_ACCEPT,
            uploadHeader: addDocuments.powerOfAttorney.uploadHeader,
            uploadDescription: addDocuments.general.uploadDescription,
            uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            condition: (formValue: FormValue) =>
              isPowerOfAttorney(formValue) &&
              !isUniqueAssignee(formValue, !!isAssignee) &&
              !hasReceivedProxyDocument(formValue),
          }),
          buildDescriptionField({
            id: 'attachments.deathCertificateFile.title',
            title: addDocuments.deathCertificate.title,
            description: '',
            space: 5,
            titleVariant: 'h5',
            condition: (formValue: FormValue) =>
              isReportingOnBehalfOfInjured(formValue) &&
              isFatalAccident(formValue) &&
              !hasReceivedPoliceReport(formValue),
          }),
          buildFileUploadField({
            id: 'attachments.deathCertificateFile.file',
            title: '',
            maxSize: FILE_SIZE_LIMIT,
            maxSizeErrorText: error.attachmentMaxSizeError,
            uploadAccept: UPLOAD_ACCEPT,
            uploadHeader: addDocuments.deathCertificate.uploadHeader,
            uploadDescription: addDocuments.general.uploadDescription,
            uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            condition: (formValue: FormValue) =>
              isReportingOnBehalfOfInjured(formValue) &&
              isFatalAccident(formValue) &&
              !hasReceivedPoliceReport(formValue),
          }),
          buildDescriptionField({
            id: 'attachments.additionalAttachments.title',
            title: addDocuments.additional.title,
            description: '',
            space: 5,
            titleVariant: 'h5',
          }),
          buildDescriptionField({
            id: 'attachments.additionalAttachments.description',
            title: '',
            description: addDocuments.general.additionalDocumentsDescription,
            space: 3,
          }),
          buildFileUploadField({
            id: 'attachments.additionalFiles.file',
            title: '',
            maxSize: FILE_SIZE_LIMIT,
            maxSizeErrorText: error.attachmentMaxSizeError,
            uploadAccept: UPLOAD_ACCEPT,
            uploadHeader: addDocuments.general.uploadHeader,
            uploadDescription: addDocuments.general.uploadDescription,
            uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            condition: (formValue: FormValue) =>
              !isUniqueAssignee(formValue, !!isAssignee),
          }),
          buildFileUploadField({
            id: 'attachments.additionalFilesFromReviewer.file',
            title: '',
            maxSize: FILE_SIZE_LIMIT,
            maxSizeErrorText: error.attachmentMaxSizeError,
            uploadAccept: UPLOAD_ACCEPT,
            uploadHeader: addDocuments.general.uploadHeader,
            uploadDescription: addDocuments.general.uploadDescription,
            uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            condition: (formValue: FormValue) =>
              isUniqueAssignee(formValue, !!isAssignee),
          }),
          buildSubmitField({
            id: 'overview.submit',
            title: '',
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: addDocuments.general.submitButtonLabel,
                type: 'primary',
              },
            ],
          }),
        ],
      }),
    ],
  })
