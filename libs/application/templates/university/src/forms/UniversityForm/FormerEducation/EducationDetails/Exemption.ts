import {
  buildCustomField,
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { formerEducation } from '../../../../lib/messages/formerEducation'
import { Routes } from '../../../../lib/constants'
import { FILE_SIZE_LIMIT } from '../../../../shared'
import { FormValue } from '@island.is/application/types'
import { ApplicationTypes } from '@island.is/university-gateway'

export const ExemptionSubSection = buildSubSection({
  id: `${Routes.EDUCATIONDETAILS}.exemptionDetails`,
  title: formerEducation.labels.educationDetails.pageTitle,
  condition: (answers: FormValue) => {
    const optionAnswers = getValueViaPath(answers, 'educationOptions')
    return optionAnswers === ApplicationTypes.EXEMPTION
  },
  children: [
    buildMultiField({
      id: `${Routes.EDUCATIONDETAILS}.exemptionDetailsMultiField`,
      title: formerEducation.labels.educationDetails.pageTitle,
      description: formerEducation.labels.educationDetails.pageDescription,
      children: [
        buildFileUploadField({
          id: `${Routes.EDUCATIONDETAILS}.exemptionDetails.degreeAttachments`,
          title: formerEducation.labels.educationDetails.degreeFileUploadTitle,
          introduction: '',
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          doesNotRequireAnswer: false,
          // TODO decide which types of file can be uploaded
          uploadHeader:
            formerEducation.labels.educationDetails.degreeFileUploadTitle,
          uploadDescription:
            formerEducation.labels.educationDetails.degreeFileUploadDescription,
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}.exemptionDetails.moreDetails`,
          variant: 'textarea',
          title: formerEducation.labels.educationDetails.moreDetailsLabel,
        }),
        buildCustomField({
          id: `${Routes.EDUCATIONDETAILS}.finishedDetails`,
          title: '',
          component: 'EducationDetails',
        }),
      ],
    }),
  ],
})
