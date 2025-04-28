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
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../utils/constants'
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
          id: 'resume.resumeFile.file',
          uploadHeader: employmentSearchMessages.resume.uploadHeader,
          uploadDescription: employmentSearchMessages.resume.uploadDescription,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
          condition: doesOwnResume,
        }),
      ],
    }),
  ],
})
