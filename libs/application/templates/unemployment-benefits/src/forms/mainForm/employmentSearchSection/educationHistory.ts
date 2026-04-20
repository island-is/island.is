import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildFileUploadField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import {
  education as educationMessages,
  application as applicationMessages,
} from '../../../lib/messages'

import {
  getCourseOfStudy,
  getDegreeOptions,
  getLevelsOfStudyOptions,
  isCurrentlyStudying,
  lastSemesterGeneralCondition,
  sameEducationAsCurrent,
  showFinishedEducationDateField,
  showFinishedEducationField,
  wasStudyingInTheLastYear,
  wasStudyingLastSemester,
  getYearOptions,
} from '../../../utils/educationInformation'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../shared'
import { Application } from '@island.is/application/types'

export const educationHistorySubSection = buildSubSection({
  id: 'educationHistorySubSection',
  title: employmentSearchMessages.educationHistory.sectionTitle,
  children: [
    buildMultiField({
      id: 'educationHistorySubSection',
      title: employmentSearchMessages.educationHistory.pageTitle,
      description: employmentSearchMessages.educationHistory.pageDescription,
      children: [
        //Núverandi nám
        buildDescriptionField({
          id: 'educationHistory.currentStudies.description',
          title: educationMessages.labels.currentStudiesDescriptionTitle,
          titleVariant: 'h5',
          condition: isCurrentlyStudying,
        }),
        buildSelectField({
          id: 'educationHistory.currentStudies.levelOfStudy',
          title: educationMessages.labels.levelOfStudyLabel,
          required: true,
          options: (application, _, locale) =>
            getLevelsOfStudyOptions(application, locale),
          condition: isCurrentlyStudying,
        }),
        buildSelectField({
          id: 'educationHistory.currentStudies.degree',
          title: educationMessages.labels.schoolDegreeLabel,
          required: true,
          options: (application, _, locale) => {
            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.currentStudies.levelOfStudy',
                '',
              ) ?? ''
            return getDegreeOptions(application, locale, levelOfStudy)
          },
          condition: isCurrentlyStudying,
        }),
        buildSelectField({
          id: 'educationHistory.currentStudies.courseOfStudy',
          title: educationMessages.labels.courseOfStudyLabel,
          required: true,
          options: (application, _, locale) => {
            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.currentStudies.levelOfStudy',
                '',
              ) ?? ''
            const degreeAnswer =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.currentStudies.degree',
                '',
              ) ?? ''
            return getCourseOfStudy(
              application,
              levelOfStudy,
              degreeAnswer,
              locale,
            )
          },
          condition: isCurrentlyStudying,
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.units',
          title: educationMessages.labels.schoolProgramUnitsLabelPerSemester,
          required: true,
          condition: isCurrentlyStudying,
        }),
        buildAlertMessageField({
          id: 'educationHistory.currentEducation.schoolAlert',
          message: educationMessages.labels.currentSchoolDegreeInformation,
          alertType: 'info',
          condition: isCurrentlyStudying,
        }),
        buildFileUploadField({
          id: 'educationHistory.currentStudies.degreeFile',
          title: educationMessages.labels.currentSchoolDegreeFileNameLabel,
          uploadHeader:
            educationMessages.labels.currentSchoolDegreeFileNameLabel,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          condition: isCurrentlyStudying,
          uploadAccept: UPLOAD_ACCEPT,
          maxSize: FILE_SIZE_LIMIT,
          uploadMultiple: true,
          doesNotRequireAnswer: true,
        }),

        //Nám á seinustu önn
        buildDescriptionField({
          id: 'educationHistory.lastSemester.description',
          title: educationMessages.labels.studyingLastSemesterDescriptionTitle,
          titleVariant: 'h5',
          condition: wasStudyingLastSemester,
        }),
        buildCheckboxField({
          id: 'educationHistory.lastSemester.sameAsAboveEducation',
          width: 'full',
          backgroundColor: 'white',
          large: false,
          options: [
            {
              value: YES,
              label: educationMessages.labels.sameAsCurrentEducationCheckbox,
            },
          ],
          setOnChange: async (_option, application) => {
            if (showFinishedEducationField(application.answers))
              return [
                {
                  key: 'educationHistory.finishedEducation.sameAsAboveEducation',
                  value: undefined,
                },
              ]
            return []
          },
          condition: (answers) =>
            wasStudyingLastSemester(answers) && isCurrentlyStudying(answers),
        }),
        buildSelectField({
          id: 'educationHistory.lastSemester.levelOfStudy',
          title: educationMessages.labels.levelOfStudyLabel,
          required: true,
          options: (application, _, locale) =>
            getLevelsOfStudyOptions(application, locale),
          condition: lastSemesterGeneralCondition,
        }),
        buildSelectField({
          id: 'educationHistory.lastSemester.degree',
          title: educationMessages.labels.schoolDegreeLabel,
          required: true,
          options: (application, _, locale) => {
            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.lastSemester.levelOfStudy',
                '',
              ) ?? ''
            return getDegreeOptions(application, locale, levelOfStudy)
          },
          condition: lastSemesterGeneralCondition,
        }),
        buildSelectField({
          id: 'educationHistory.lastSemester.courseOfStudy',
          title: educationMessages.labels.courseOfStudyLabel,
          required: true,
          options: (application, _, locale) => {
            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.lastSemester.levelOfStudy',
                '',
              ) ?? ''
            const degreeAnswer =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.lastSemester.degree',
                '',
              ) ?? ''
            return getCourseOfStudy(
              application,
              levelOfStudy,
              degreeAnswer,
              locale,
            )
          },
          condition: lastSemesterGeneralCondition,
        }),
        buildTextField({
          id: 'educationHistory.lastSemester.units',
          title: educationMessages.labels.schoolProgramUnitsLabelPerSemester,
          required: true,
          condition: wasStudyingLastSemester,
        }),
        buildSelectField({
          id: 'educationHistory.lastSemester.endDate',
          title: educationMessages.labels.previousSchoolEndDate,
          options: getYearOptions,
          condition: lastSemesterGeneralCondition,
        }),
        buildCheckboxField({
          id: 'educationHistory.lastSemester.unfinishedStudy',
          width: 'full',
          backgroundColor: 'white',
          large: false,
          options: [
            {
              value: YES,
              label: educationMessages.labels.endOfStudiesPlaceholder,
            },
          ],
          clearOnChange: [`educationHistory.lastSemester.endDate`],
          condition: lastSemesterGeneralCondition,
        }),
        buildAlertMessageField({
          id: 'educationHistory.lastSemester.schoolAlert',
          message: educationMessages.labels.lastSemesterSchoolDegreeInformation,
          alertType: 'info',
          condition: wasStudyingLastSemester,
        }),
        buildFileUploadField({
          id: 'educationHistory.lastSemester.degreeFile',
          title: educationMessages.labels.lastSemesterSchoolDegreeFileNameLabel,
          uploadHeader:
            educationMessages.labels.lastSemesterSchoolDegreeFileNameLabel,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          condition: wasStudyingLastSemester,
          uploadAccept: UPLOAD_ACCEPT,
          maxSize: FILE_SIZE_LIMIT,
          uploadMultiple: true,
          doesNotRequireAnswer: true,
        }),

        //Klárað nám á seinustu 12 mánuðum
        buildDescriptionField({
          id: 'educationHistory.finishedEducation.description',
          title:
            educationMessages.labels.finishedLastTwelveMonthsDescriptionTitle,
          titleVariant: 'h5',
          condition: wasStudyingInTheLastYear,
        }),
        buildCheckboxField({
          id: 'educationHistory.finishedEducation.sameAsAboveEducation',
          width: 'full',
          backgroundColor: 'white',
          large: false,
          options: [
            {
              value: YES,
              label:
                educationMessages.labels.sameAsLastSemesterEducationCheckbox,
            },
          ],
          condition: (answers) =>
            wasStudyingLastSemester(answers) &&
            wasStudyingInTheLastYear(answers) &&
            !sameEducationAsCurrent(answers), // if last semester education is the same as current, then it's not finished and this checkmark is not relevant
        }),
        buildSelectField({
          id: 'educationHistory.finishedEducation.levelOfStudy',
          title: educationMessages.labels.levelOfStudyLabel,
          required: true,
          options: (application, _, locale) =>
            getLevelsOfStudyOptions(application, locale),
          condition: showFinishedEducationField,
        }),
        buildSelectField({
          id: 'educationHistory.finishedEducation.degree',
          title: educationMessages.labels.schoolDegreeLabel,
          required: true,
          options: (application, _, locale) => {
            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.finishedEducation.levelOfStudy',
                '',
              ) ?? ''
            return getDegreeOptions(application, locale, levelOfStudy)
          },
          condition: showFinishedEducationField,
        }),
        buildSelectField({
          id: 'educationHistory.finishedEducation.courseOfStudy',
          title: educationMessages.labels.courseOfStudyLabel,
          required: true,
          options: (application, _, locale) => {
            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.finishedEducation.levelOfStudy',
                '',
              ) ?? ''
            const degreeAnswer =
              getValueViaPath<string>(
                application.answers,
                'educationHistory.finishedEducation.degree',
                '',
              ) ?? ''
            return getCourseOfStudy(
              application,
              levelOfStudy,
              degreeAnswer,
              locale,
            )
          },
          condition: showFinishedEducationField,
        }),
        buildTextField({
          id: 'educationHistory.finishedEducation.units',
          title: educationMessages.labels.schoolProgramUnitsLabel,
          required: true,
          condition: wasStudyingInTheLastYear,
        }),
        buildSelectField({
          id: 'educationHistory.finishedEducation.endDate',
          title: educationMessages.labels.previousSchoolEndDate,
          required: (application: Application) =>
            showFinishedEducationDateField(application.answers),
          options: getYearOptions,
          condition: showFinishedEducationDateField, // if education is the same but the user did not fill out yearFinished in lastSemester column
        }),
        buildAlertMessageField({
          id: 'educationHistory.finishedEducation.educationAlert',
          message: educationMessages.labels.graduatedSchoolDegreeInformation,
          alertType: 'info',
          condition: (answers) => wasStudyingInTheLastYear(answers),
        }),
        buildFileUploadField({
          id: 'educationHistory.finishedEducation.degreeFile',
          title: educationMessages.labels.graduatedSchoolDegreeFileNameLabel,
          uploadHeader:
            educationMessages.labels.graduatedSchoolDegreeFileNameLabel,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          condition: (answers) => wasStudyingInTheLastYear(answers),
          uploadAccept: UPLOAD_ACCEPT,
          maxSize: FILE_SIZE_LIMIT,
          uploadMultiple: true,
          doesNotRequireAnswer: true,
        }),

        //Optional field repeater to add more education history

        buildFieldsRepeaterField({
          id: 'educationHistory.educationHistory',
          formTitle: educationMessages.labels.educationHistoryTitle,
          formTitleNumbering: 'none',
          minRows: 0,
          addItemButtonText: educationMessages.labels.addItemButtonText,
          fields: {
            levelOfStudy: {
              label: educationMessages.labels.levelOfStudyLabel,
              component: 'select',
              required: true,
              options: (application, _, locale) => {
                locale = locale ? locale : 'is'
                return getLevelsOfStudyOptions(application, locale)
              },
            },
            degree: {
              label: educationMessages.labels.schoolDegreeLabel,
              component: 'select',
              required: true,
              options: (application, activeField, locale) => {
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                locale = locale ? locale : 'is'
                return getDegreeOptions(application, locale, levelOfStudy)
              },
            },
            courseOfStudy: {
              label: educationMessages.labels.courseOfStudyLabel,
              component: 'select',
              required: true,
              options: (application, activeField, locale) => {
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                const degreeAnswer = (activeField?.degree as string) ?? ''

                locale = locale ? locale : 'is'
                return getCourseOfStudy(
                  application,
                  levelOfStudy,
                  degreeAnswer,
                  locale,
                )
              },
            },
            endDate: {
              label: educationMessages.labels.endOfStudies,
              component: 'select',
              placeholder: educationMessages.labels.endOfStudiesPlaceholder,
              options: getYearOptions,
            },
            unfinishedStudy: {
              component: 'checkbox',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label: educationMessages.labels.endOfStudiesPlaceholder,
                },
              ],
              clearOnChange: (index: number) => [
                `educationHistory.educationHistory[${index}].endOfStudy`,
              ],
            },
          },
        }),
      ],
    }),
  ],
})
