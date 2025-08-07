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
import { education as educationMessages } from '../../../lib/messages'

import { Application, Field } from '@island.is/application/types'
import {
  GaldurDomainModelsEducationEducationDegreeDTO,
  GaldurDomainModelsEducationEducationSubjectDTO,
  GaldurDomainModelsEducationProgramDTO,
} from '@island.is/clients/vmst-unemployment'
import { formatDate } from '../../../utils'
import {
  isCurrentlyStudying,
  wasStudyingLastTwelveMonths,
} from '../../../utils/educationInformation'
import { Locale } from '@island.is/shared/types'

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
          title: {
            ...educationMessages.labels.educationHistoryTitle,
            values: {
              value: 1,
            },
          },
          titleVariant: 'h5',
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.levelOfStudy',
          title: educationMessages.labels.levelOfStudyLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (
            application: Application,
            field: Field,
            locale: Locale,
          ) => {
            const programId =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.levelOfStudy',
              ) ?? ''
            const education =
              getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.educationPrograms',
              ) ?? []
            const program = education.find((item) => item.id === programId)
            return program?.name
              ? locale === 'is'
                ? program?.name
                : program?.english
              : ''
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.courseOfStudy',
          title: educationMessages.labels.courseOfStudyLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const education = getValueViaPath<
              GaldurDomainModelsEducationProgramDTO[]
            >(
              application.externalData,
              'unemploymentApplication.data.supportData.educationPrograms',
            )

            const courseOfStudyAnswer =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.courseOfStudy',
                '',
              ) ?? ''

            let chosenSubject:
              | GaldurDomainModelsEducationEducationSubjectDTO
              | undefined

            education?.find((program) => {
              const courseOfStudy = program.degrees?.find((degree) => {
                return degree.subjects?.find((subject) => {
                  const match = subject.id === courseOfStudyAnswer
                  if (match) {
                    chosenSubject = subject
                  }
                  return match
                })
              })

              return courseOfStudy
            })
            return chosenSubject ? chosenSubject.name : ''
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.programDegree',
          title: educationMessages.labels.schoolDegreeLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (
            application: Application,
            field: Field,
            locale: Locale,
          ) => {
            const degreeAnswer =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.programDegree',
              ) ?? ''
            const education =
              getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.educationPrograms',
              ) ?? []
            let degreeValue:
              | GaldurDomainModelsEducationEducationDegreeDTO
              | undefined

            education?.find((program) => {
              program.degrees?.find((degree) => {
                const match = degree.id === degreeAnswer
                if (match) {
                  degreeValue = degree
                }
                return match
              })
            })
            return degreeValue
              ? locale === 'is'
                ? degreeValue.name
                : degreeValue.english
              : ''
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            isCurrentlyStudying(answers),
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.programUnits',
          title: educationMessages.labels.schoolProgramUnitsLabel,
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
          id: 'educationHistory.currentStudies.programEnd',
          title: educationMessages.labels.expectedEndOfStudyLabel,
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
              ...educationMessages.labels.educationHistoryTitle,
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
          addItemButtonText: educationMessages.labels.addItemButtonText,
          fields: {
            levelOfStudy: {
              label: educationMessages.labels.levelOfStudyLabel,
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
              label: educationMessages.labels.schoolDegreeLabel,
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
              label: educationMessages.labels.courseOfStudyLabel,
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
                  label: educationMessages.labels.studyNotCompletedLabel,
                },
              ],
            },
          },
        }),
      ],
    }),
  ],
})
