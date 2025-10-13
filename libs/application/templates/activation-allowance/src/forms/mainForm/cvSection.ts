import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
  YesOrNoEnum,
} from '@island.is/application/core'
import { cv } from '../../lib/messages'

export const cvSection = buildSection({
  id: 'cvSection',
  title: cv.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'cvMultiField',
      title: cv.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'cv.haveCVDescription',
          title: cv.labels.haveCV,
          titleVariant: 'h5',
          marginBottom: 0,
        }),
        buildRadioField({
          id: 'cv.haveCV',
          space: 0,
          width: 'half',
          defaultValue: NO,
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'cv.alertMessage',
          alertType: 'info',
          message: cv.labels.alertMessage,
          marginBottom: 0,
        }),
        buildFileUploadField({
          id: 'cv.cvFile.file',
          uploadHeader: cv.labels.uploadHeader,
          uploadDescription: cv.labels.uploadDescription,
          maxSize: 10000000,
          uploadAccept: '.pdf, .jpg, .jpeg, .png, .doc, .docx',
          condition: (answers) => {
            const haveCV = getValueViaPath<YesOrNoEnum>(answers, 'cv.haveCV')
            return haveCV === YES
          },
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: 'cv.otherDescription',
          title: cv.labels.otherQuestion,
          titleVariant: 'h5',
          marginBottom: 0,
          marginTop: 2,
        }),
        buildTextField({
          id: 'cv.other',
          title: cv.labels.other,
          variant: 'textarea',
          rows: 6,
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
