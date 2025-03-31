import {
  buildAlertMessageField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  YES,
  NO,
} from '@island.is/application/core'
import {
  addDocuments,
  application,
  attachments,
  error,
  fatalAccident,
  fatalAccidentAttachment,
  injuredPersonInformation,
} from '../../../lib/messages'
import { isRepresentativeOfCompanyOrInstitute } from '../../../utils/miscUtils'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../utils/constants'
import { isReportingOnBehalfOfInjured } from '../../../utils/reportingUtils'
import { isFatalAccident } from '../../../utils/accidentUtils'
import { AttachmentsEnum } from '../../../utils/enums'

// Injury certificate and fatal accident section
export const attachmentsSubSection = buildSubSection({
  id: 'attachments.section',
  title: attachments.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'attachments',
      title: attachments.general.heading,
      children: [
        buildRadioField({
          id: 'injuryCertificate.answer',
          description: attachments.general.description,
          required: true,
          options: (application) =>
            isRepresentativeOfCompanyOrInstitute(application.answers)
              ? [
                  {
                    value: AttachmentsEnum.INJURYCERTIFICATE,
                    label: attachments.labels.injuryCertificate,
                  },
                  {
                    value: AttachmentsEnum.SENDCERTIFICATELATER,
                    label: attachments.labels.sendCertificateLater,
                  },
                ]
              : [
                  {
                    value: AttachmentsEnum.INJURYCERTIFICATE,
                    label: attachments.labels.injuryCertificate,
                  },
                  {
                    value: AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
                    label: attachments.labels.hospitalSendsCertificate,
                  },
                  {
                    value: AttachmentsEnum.SENDCERTIFICATELATER,
                    label: attachments.labels.sendCertificateLater,
                  },
                ],
        }),
        buildAlertMessageField({
          id: 'attachments.injuryCertificate.alert',
          title: attachments.labels.alertMessage,
          message: attachments.general.alertMessage,
          doesNotRequireAnswer: true,
          condition: (formValue) =>
            getValueViaPath(formValue, 'injuryCertificate.answer') ===
            AttachmentsEnum.SENDCERTIFICATELATER,
          alertType: 'warning',
        }),
      ],
    }),
    buildMultiField({
      id: 'attachments.injuryCertificateFile.subSection',
      title: attachments.general.heading,
      children: [
        buildFileUploadField({
          id: 'attachments.injuryCertificateFile.file',
          title: attachments.general.heading,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: error.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: injuredPersonInformation.upload.uploadHeader,
          uploadDescription: attachments.general.uploadDescription,
          uploadButtonLabel: attachments.general.uploadButtonLabel,
          introduction: attachments.general.uploadIntroduction,
        }),
      ],
      condition: (formValue) =>
        getValueViaPath(formValue, 'injuryCertificate.answer') ===
        AttachmentsEnum.INJURYCERTIFICATE,
    }),
    buildMultiField({
      id: 'fatalAccidentMulti.section',
      title: fatalAccident.general.sectionTitle,
      condition: (formValue) => isReportingOnBehalfOfInjured(formValue),
      children: [
        buildRadioField({
          id: 'wasTheAccidentFatal',
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          options: [
            { value: YES, label: application.general.yesOptionLabel },
            { value: NO, label: application.general.noOptionLabel },
          ],
        }),
      ],
    }),
    buildMultiField({
      id: 'fatalAccidentUploadDeathCertificateNowMulti',
      title: fatalAccidentAttachment.labels.title,
      description: fatalAccidentAttachment.labels.description,
      condition: (formValue) =>
        isReportingOnBehalfOfInjured(formValue) &&
        formValue.wasTheAccidentFatal === YES,
      children: [
        buildRadioField({
          id: 'fatalAccidentUploadDeathCertificateNow',
          backgroundColor: 'blue',
          required: true,
          options: [
            {
              value: YES,
              label: fatalAccidentAttachment.options.addAttachmentsNow,
            },
            {
              value: NO,
              label: fatalAccidentAttachment.options.addAttachmentsLater,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'attachments.injuryCertificate.alert',
          title: fatalAccident.alertMessage.title,
          message: fatalAccident.alertMessage.description,
          doesNotRequireAnswer: true,
          alertType: 'warning',
          condition: (formValue) =>
            getValueViaPath(
              formValue,
              'fatalAccidentUploadDeathCertificateNow',
            ) === NO,
        }),
      ],
    }),

    buildMultiField({
      id: 'attachments.deathCertificateFile.subSection',
      title: attachments.general.uploadTitle,
      condition: (formValue) =>
        isReportingOnBehalfOfInjured(formValue) &&
        isFatalAccident(formValue) &&
        formValue.fatalAccidentUploadDeathCertificateNow === YES,
      children: [
        buildFileUploadField({
          id: 'attachments.deathCertificateFile.file',
          title: attachments.general.uploadHeader,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: error.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: attachments.general.uploadHeader,
          uploadDescription: attachments.general.uploadDescription,
          uploadButtonLabel: attachments.general.uploadButtonLabel,
          introduction: attachments.general.uploadIntroduction,
        }),
      ],
    }),
    buildMultiField({
      id: 'attachments.additionalFilesMulti',
      title: attachments.general.heading,
      children: [
        buildRadioField({
          id: 'additionalAttachments.answer',
          description: attachments.general.additionalAttachmentDescription,
          required: true,
          options: () => [
            {
              value: AttachmentsEnum.ADDITIONALNOW,
              label: attachments.labels.additionalNow,
            },
            {
              value: AttachmentsEnum.ADDITIONALLATER,
              label: attachments.labels.additionalLater,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'attachments.injuryCertificate.alert',
          title: attachments.labels.alertMessage,
          message: attachments.general.alertMessage,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (formValue) =>
            getValueViaPath(formValue, 'additionalAttachments.answer') ===
            AttachmentsEnum.ADDITIONALLATER,
        }),
      ],
    }),
    buildMultiField({
      id: 'attachments.additionalAttachments.subSection',
      title: attachments.general.heading,
      condition: (formValue) =>
        getValueViaPath(formValue, 'additionalAttachments.answer') ===
        AttachmentsEnum.ADDITIONALNOW,
      children: [
        buildFileUploadField({
          id: 'attachments.additionalFiles.file',
          title: attachments.general.heading,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: error.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: addDocuments.general.uploadHeader,
          uploadDescription: addDocuments.general.uploadDescription,
          uploadButtonLabel: addDocuments.general.uploadButtonLabel,
          introduction: addDocuments.general.additionalDocumentsDescription,
        }),
      ],
    }),
  ],
})
