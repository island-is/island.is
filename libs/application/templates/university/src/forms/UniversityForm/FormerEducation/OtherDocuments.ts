import {
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'
import { FILE_SIZE_LIMIT } from '../../../shared'
import { FormValue } from '@island.is/application/types'
import { UniversityApplication } from '../../../lib/dataSchema'

export const OtherDocumentsSubSection = buildSubSection({
  id: Routes.OTHERDOCUMENTS,
  title: formerEducation.labels.otherDocuments.pageTitle,
  children: [
    buildMultiField({
      id: 'otherDocumentsMultiField',
      title: '',
      children: [
        buildFileUploadField({
          id: `${Routes.OTHERDOCUMENTS}.degreeAttachments`,
          title: formerEducation.labels.educationDetails.degreeFileUploadTitle,
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
          //   uploadHeader:
          //     supportingDocuments.labels.otherDocuments.birthCertificate,
          //   uploadDescription:
          //     supportingDocuments.labels.otherDocuments.acceptedFileTypes,
          //   uploadButtonLabel:
          //     supportingDocuments.labels.otherDocuments.buttonText,
        }),
      ],
    }),
  ],
})
