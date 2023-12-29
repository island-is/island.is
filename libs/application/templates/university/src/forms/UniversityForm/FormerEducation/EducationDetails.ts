import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDateField,
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'
import { FormValue, YES } from '@island.is/application/types'
import { UniversityApplication } from '../../../lib/dataSchema'
import { FILE_SIZE_LIMIT } from '../../../shared'
import { useLocale } from '@island.is/localization'

export const EducationDetailsSubSection = buildSubSection({
  id: Routes.EDUCATIONDETAILS,
  title: formerEducation.labels.educationDetails.pageTitle,
  children: [
    buildMultiField({
      id: 'EducationDetailsMultiField',
      title: 'TODO',
      children: [
        buildAlertMessageField({
          id: `${Routes.EDUCATIONOPTIONS}.innuInformation`,
          title: '',
          description:
            formerEducation.labels.educationDetails.informationAlertDescription,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONOPTIONS}.school`,
          title: formerEducation.labels.educationDetails.schoolLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONOPTIONS}.degreeLevel`,
          title: formerEducation.labels.educationDetails.degreeLevelLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONOPTIONS}.degreeMajor`,
          title: formerEducation.labels.educationDetails.degreeMajorLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONOPTIONS}.finishedUnits`,
          title: formerEducation.labels.educationDetails.finishedUnitsLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONOPTIONS}.averageGrade`,
          title: formerEducation.labels.educationDetails.averageGradeLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONOPTIONS}.degreeCountry`,
          title: formerEducation.labels.educationDetails.degreeCountryLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildDateField({
          id: `${Routes.EDUCATIONOPTIONS}.beginningDate`,
          title: formerEducation.labels.educationDetails.beginningDateLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildDateField({
          id: `${Routes.EDUCATIONOPTIONS}.endDate`,
          title: formerEducation.labels.educationDetails.endDateLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
        buildCheckboxField({
          id: `${Routes.EDUCATIONOPTIONS}.degreeFinished`,
          title:
            formerEducation.labels.educationDetails.degreeFinishedCheckboxLabel,
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
          id: `${Routes.EDUCATIONOPTIONS}.degreeAttachments`,
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
        buildTextField({
          id: `${Routes.EDUCATIONOPTIONS}.moreDetails`,
          title: formerEducation.labels.educationDetails.moreDetailsLabel,
          condition: (formValue: FormValue, externalData) => {
            const answers = formValue as UniversityApplication
            const chosenOption = answers.educationOptions
            return true
          },
        }),
      ],
    }),
  ],
})
