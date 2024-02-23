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
  getValueViaPath,
} from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'
import {
  Application,
  Field,
  FormValue,
  YES,
} from '@island.is/application/types'
import { UniversityApplication } from '../../../lib/dataSchema'
import { FILE_SIZE_LIMIT } from '../../../shared'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { InlineResponse200Items } from '@island.is/clients/inna'

export const EducationDetailsSubSection = buildSubSection({
  id: Routes.EDUCATIONDETAILS,
  title: formerEducation.labels.educationDetails.pageTitle,
  children: [
    buildMultiField({
      id: 'EducationDetailsMultiField',
      title: formerEducation.labels.educationDetails.pageTitle,
      description: formerEducation.labels.educationDetails.pageDescription,
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
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return innaData[0].organisation || ''
          },
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
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return innaData ? 'framhaldsskoli' : ''
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return chosenOption !== 'exemption' // Every other options shows this field
          },
          options: () => {
            return [
              {
                label:
                  formerEducation.labels.educationDetails
                    .framhaldsskoliSelectionLabel,
                value: 'framhaldsskoli',
              },
              {
                label:
                  formerEducation.labels.educationDetails
                    .bachelorsSelectionLabel,
                value: 'bachelors',
              },
              {
                label:
                  formerEducation.labels.educationDetails.mastersSelectionLabel,
                value: 'masters',
              },
              {
                label:
                  formerEducation.labels.educationDetails.doctorsSelectionLabel,
                value: 'doctors',
              },
            ]
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeMajor`,
          title: formerEducation.labels.educationDetails.degreeMajorLabel,
          width: 'half',
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return innaData[0].diplomaLongName || ''
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication

            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return true
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
            }
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].finishedUnits`,
          title: formerEducation.labels.educationDetails.finishedUnitsLabel,
          width: 'half',
          variant: 'number',
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return innaData[0].diplomaCreditsTotal || 0 // TODO use diplomaCredits or diplomaCreditsTotal?
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return true
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
            }
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}[0].averageGrade`,
          title: formerEducation.labels.educationDetails.averageGradeLabel,
          width: 'half',
          variant: 'number',
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return 0 // TODO calculate this from all courses or add to service?
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return true
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
            }
          },
        }),
        buildSelectField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeCountry`,
          title: formerEducation.labels.educationDetails.degreeCountryLabel,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            if (innaData) {
              return 'IS'
            }

            return ''
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return true
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
            }
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
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return '' // TODO the service only gives me 1 date, the end of the diploma..
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return true
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
            }
          },
        }),
        buildDateField({
          id: `${Routes.EDUCATIONDETAILS}[0].endDate`,
          title: formerEducation.labels.educationDetails.endDateLabel,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return innaData[0].diplomaDate || '' // TODO the service only gives me 1 date, the end of the diploma..
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return true
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption === 'diploma' || chosenOption === 'thirdLevel'
            }
          },
        }),
        buildCheckboxField({
          id: `${Routes.EDUCATIONDETAILS}[0].degreeFinished`,
          title: '',
          defaultValue: (application: Application) => {
            const innaData = getValueViaPath(
              application.externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>

            return !!innaData[0] || false
          },
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return false
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption === 'diploma'
            }
          },
          options: () => {
            return [
              {
                label:
                  formerEducation.labels.educationDetails
                    .degreeFinishedCheckboxLabel,
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
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return false
            } else {
              const chosenOption = answers.educationOptions
              return chosenOption !== 'notFinished'
            }
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
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const innaData = getValueViaPath(
              externalData,
              'innaEducation.data',
              [],
            ) as Array<InlineResponse200Items>
            if (innaData) {
              return false
            }
            return true
          },
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
