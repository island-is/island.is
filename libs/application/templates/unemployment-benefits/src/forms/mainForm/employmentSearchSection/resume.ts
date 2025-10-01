import {
  buildAlertMessageField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  coreMessages,
  NO,
  YES,
} from '@island.is/application/core'
import {
  employmentSearch as employmentSearchMessages,
  application as applicationMessages,
} from '../../../lib/messages'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../shared/constants'
import { doesOwnResume } from '../../../utils'

export const resumeSubSection = buildSubSection({
  id: 'resumeSubSection',
  title: employmentSearchMessages.resume.sectionTitle,
  children: [
    buildMultiField({
      id: 'resumeSubSection',
      title: employmentSearchMessages.resume.pageTitle,
      children: [
        buildRadioField({
          id: 'resume.doesOwnResume',
          width: 'half',
          title: employmentSearchMessages.resume.ownResumeLabel,
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
          id: 'ownResumeAlert',
          message: employmentSearchMessages.resume.ownResumeAlert,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: doesOwnResume,
        }),
        buildAlertMessageField({
          id: 'doesNotOwnResumeAlert',
          message: employmentSearchMessages.resume.doesNotOwnResumeAlert,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (answers) => !doesOwnResume(answers),
        }),
        buildFileUploadField({
          id: 'resume.resumeFile',
          uploadHeader: employmentSearchMessages.resume.uploadHeader,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          maxSize: FILE_SIZE_LIMIT,
          uploadMultiple: true,
          uploadAccept: UPLOAD_ACCEPT,
          condition: doesOwnResume,
        }),
      ],
    }),
  ],
})
