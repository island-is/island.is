import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import {
  GaldurDomainModelsEducationItem,
  GaldurDomainModelsEducationProgramDTO,
} from '@island.is/clients/vmst-unemployment'
import { formatDate } from '../../../utils'
import {
  isCurrentlyStudying,
  wasStudyingLastTwelveMonths,
} from '../../../utils/educationInformation'

export const educationHistorySubSection = buildSubSection({
  id: 'educationHistorySubSection',
  title: employmentSearchMessages.educationHistory.sectionTitle,
  children: [
    buildMultiField({
      id: 'educationHistorySubSection',
      title: employmentSearchMessages.educationHistory.pageTitle,
      children: [
        buildDescriptionField({
          id: 'educationHistory.currentStudies.description',
          title: employmentSearchMessages.educationHistory.currentStudiesLabel,
          titleVariant: 'h5',
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.programName',
          title: employmentSearchMessages.educationHistory.programNameLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const programId =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.programName',
              ) ?? ''
            const education =
              getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.educationPrograms',
              ) ?? []
            const program = education.find((item) => item.id === programId)
            return program?.name ?? ''
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.programUnits',
          title: employmentSearchMessages.educationHistory.unitsLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const units =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.programUnits',
              ) ?? ''
            return units
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.programDegree',
          title: employmentSearchMessages.educationHistory.degreeLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const degree =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.programDegree',
              ) ?? ''
            return degree
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.programEnd',
          title:
            employmentSearchMessages.educationHistory.expectedEndOfStudyLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const expectedEndOfStudy =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.programEnd',
              ) ?? ''
            return formatDate(expectedEndOfStudy)
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildFieldsRepeaterField({
          id: 'educationHistory.educationHistory',
          formTitle: (index, application) => {
            return {
              ...employmentSearchMessages.educationHistory
                .educationHistoryTitle,
              values: {
                value:
                  wasStudyingLastTwelveMonths(application.answers) &&
                  isCurrentlyStudying(application.answers)
                    ? index + 2
                    : index + 1,
              },
            }
          },
          formTitleNumbering: 'none',
          minRows: 0,
          addItemButtonText:
            employmentSearchMessages.educationHistory.addItemButtonText,
          fields: {
            levelOfStudy: {
              label:
                employmentSearchMessages.educationHistory.levelOfStudyLabel,
              component: 'select',
              options: (application, _, locale) => {
                const education =
                  getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                    application.externalData,
                    'unemploymentApplication.data.supportData.educationPrograms',
                  ) ?? []
                return (
                  education.map((program) => ({
                    value: program.id ?? '',
                    label:
                      (locale === 'is'
                        ? program.name
                        : program.english ?? program.name) || '',
                  })) ?? []
                )
              },
            },
            degree: {
              label: employmentSearchMessages.educationHistory.degreeLabel,
              component: 'select',
              options: (application, activeField, locale) => {
                const education =
                  getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                    application.externalData,
                    'unemploymentApplication.data.supportData.educationPrograms',
                  ) ?? []
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                const chosenLevelDegrees = education?.filter(
                  (program) => program.id === levelOfStudy,
                )[0]?.degrees
                return (
                  chosenLevelDegrees?.map((degree) => ({
                    value: degree.id ?? '',
                    label:
                      (locale === 'is'
                        ? degree.name
                        : degree.english ?? degree.name) || '',
                  })) ?? []
                )
              },
            },
            courseOfStudy: {
              label:
                employmentSearchMessages.educationHistory.courseOfStudyLabel,
              component: 'select',
              options: (application, activeField) => {
                const education = getValueViaPath<
                  GaldurDomainModelsEducationProgramDTO[]
                >(
                  application.externalData,
                  'unemploymentApplication.data.supportData.educationPrograms',
                )
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                const degreeAnswer = (activeField?.degree as string) ?? ''
                const chosenLevelDegrees = education?.filter(
                  (program) => program.id === levelOfStudy,
                )[0]?.degrees

                const chosenDegreeSubjects = chosenLevelDegrees?.find(
                  (degree) => degree.id === degreeAnswer,
                )?.subjects
                return (
                  chosenDegreeSubjects?.map((subject) => ({
                    value: subject.id ?? '',
                    label: subject.name ?? '',
                  })) ?? []
                )
              },
            },
            studyNotCompleted: {
              component: 'checkbox',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label:
                    employmentSearchMessages.educationHistory
                      .studyNotCompletedLabel,
                },
              ],
            },
          },
        }),
      ],
    }),
  ],
})
