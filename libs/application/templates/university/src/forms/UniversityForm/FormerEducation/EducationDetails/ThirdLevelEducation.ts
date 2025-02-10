import {
  buildCustomField,
  buildDateField,
  buildFileUploadField,
  buildHiddenInput,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { formerEducation } from '../../../../lib/messages/formerEducation'
import { degreeLevelOptions, Routes } from '../../../../lib/constants'
import { FILE_SIZE_LIMIT } from '../../../../shared'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { FormValue } from '@island.is/application/types'
import { ApplicationTypes } from '@island.is/university-gateway'

export const ThirdLevelEducationSubSection = buildSubSection({
  id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails`,
  title: formerEducation.labels.educationDetails.pageTitle,
  condition: (answers: FormValue) => {
    const optionAnswers = getValueViaPath(answers, 'educationOptions')
    return optionAnswers === ApplicationTypes.THIRDLEVEL
  },
  children: [
    buildMultiField({
      id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetailsMultiField`,
      title: formerEducation.labels.educationDetails.pageTitle,
      description: formerEducation.labels.educationDetails.pageDescription,
      children: [
        buildHiddenInput({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.wasRemoved`,
          defaultValue: 'false',
        }),
        buildHiddenInput({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.readOnly`,
          defaultValue: 'false',
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.school`,
          title: formerEducation.labels.educationDetails.schoolLabel,
          width: 'half',
          required: true,
        }),
        buildSelectField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.degreeLevel`,
          title: formerEducation.labels.educationDetails.degreeLevelLabel,
          width: 'half',
          required: true,
          options: () => {
            return degreeLevelOptions
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.degreeMajor`,
          title: formerEducation.labels.educationDetails.degreeMajorLabel,
          width: 'half',
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.finishedUnits`,
          title: formerEducation.labels.educationDetails.finishedUnitsLabel,
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.averageGrade`,
          title: formerEducation.labels.educationDetails.averageGradeLabel,
          width: 'half',
          variant: 'number',
        }),
        buildSelectField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.degreeCountry`,
          title: formerEducation.labels.educationDetails.degreeCountryLabel,
          width: 'half',
          required: true,
          options: () => {
            const countries = getAllCountryCodes()
            return countries.map((country) => {
              return {
                label: country.name_is || country.name,
                value: country.code,
              }
            })
          },
        }),
        buildDateField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.beginningDate`,
          title: formerEducation.labels.educationDetails.beginningDateLabel,
          width: 'half',
        }),
        buildDateField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.endDate`,
          title: formerEducation.labels.educationDetails.endDateLabel,
          width: 'half',
          required: true,
        }),
        buildFileUploadField({
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.degreeAttachments`,
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
          id: `${Routes.EDUCATIONDETAILS}.thirdLevelDetails.moreDetails`,
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
