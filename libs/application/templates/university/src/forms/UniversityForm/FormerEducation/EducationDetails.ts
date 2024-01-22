import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDateField,
  buildFileUploadField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'
import { FormValue, YES } from '@island.is/application/types'
import { UniversityApplication } from '../../../lib/dataSchema'
import { FILE_SIZE_LIMIT } from '../../../shared'
import { getAllCountryCodes } from '@island.is/shared/utils'

export const EducationDetailsSubSection = buildSubSection({
  id: Routes.EDUCATIONDETAILS,
  title: formerEducation.labels.educationDetails.pageTitle,
  children: [
    buildMultiField({
      id: 'EducationDetailsMultiField',
      title: formerEducation.labels.educationDetails.pageTitle,
      children: [
        buildAlertMessageField({
          id: `${Routes.EDUCATIONDETAILS}[0].innuInformation`,
          title: '',
          alertType: 'info',
          message:
            formerEducation.labels.educationDetails.informationAlertDescription,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption === 'notFinished'
          },
        }),
        buildCustomField({
          id: `${Routes.EDUCATIONDETAILS}[0].wasRemoved`,
          title: '',
          component: 'HiddenTextInput',
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].school`,
          title: formerEducation.labels.educationDetails.schoolLabel,
          width: 'half',
          required: true,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption !== 'exemption' // Every other options shows this field
          },
        }),
        buildSelectField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeLevel`,
          title: formerEducation.labels.educationDetails.degreeLevelLabel,
          width: 'half',
          required: true,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption !== 'exemption' // Every other options shows this field
          },
          options: () => {
            // TODO insert correct options
            return [
              {
                label: 'Stúdentspróf',
                value: 'studentsprof',
              },
              {
                label: 'Sveinspróf',
                value: 'sveinsprof',
              },
            ]
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeMajor`,
          title: formerEducation.labels.educationDetails.degreeMajorLabel,
          width: 'half',
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            // console.log('chosenOption', chosenOption)
            return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].finishedUnits`,
          title: formerEducation.labels.educationDetails.finishedUnitsLabel,
          width: 'half',
          variant: 'number',
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].averageGrade`,
          title: formerEducation.labels.educationDetails.averageGradeLabel,
          width: 'half',
          variant: 'number',
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
          },
        }),
        buildSelectField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeCountry`,
          title: formerEducation.labels.educationDetails.degreeCountryLabel,
          width: 'half',
          required: true,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
          },
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
          id: `${Routes.EDUCATIONDETAILS}[0].beginningDate`,
          title: formerEducation.labels.educationDetails.beginningDateLabel,
          width: 'half',
          required: true,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
          },
        }),
        buildDateField({
          id: `${Routes.EDUCATIONDETAILS}[0].endDate`,
          title: formerEducation.labels.educationDetails.endDateLabel,
          width: 'half',
          required: true,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
          },
        }),
        buildCheckboxField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeFinished`,
          title: '',
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption === 'diploma'
          },
          options: () => {
            return [
              {
                label:
                  formerEducation.labels.educationDetails
                    .degreeFinishedCheckboxLabel, // TODO Check if this works without formatMessage
                value: YES,
              },
            ]
          },
        }),
        buildFileUploadField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeAttachments`,
          title: formerEducation.labels.educationDetails.degreeFileUploadTitle,
          introduction: '',
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          doesNotRequireAnswer: false,
          // TODO decide which types of file can be uploaded
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption !== 'notFinished'
          },
          uploadHeader:
            formerEducation.labels.educationDetails.degreeFileUploadTitle,
          uploadDescription:
            formerEducation.labels.educationDetails.degreeFileUploadDescription,
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].moreDetails`,
          variant: 'textarea',
          title: formerEducation.labels.educationDetails.moreDetailsLabel,
        }),
        buildCustomField({
          id: `${Routes.EDUCATIONDETAILS}`,
          title: '',
          component: 'EducationDetails',
        }),
      ],
    }),
  ],
})
