import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
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
  hasCurrentOrRecentEducation,
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
            const hasCurrentProgram = hasCurrentOrRecentEducation(
              application.answers,
            )
            if (!hasCurrentProgram) {
              return ''
            }
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
          condition: hasCurrentOrRecentEducation,
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.courseOfStudy',
          title: educationMessages.labels.courseOfStudyLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const hasCurrentProgram = hasCurrentOrRecentEducation(
              application.answers,
            )
            if (!hasCurrentProgram) {
              return ''
            }
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
          condition: hasCurrentOrRecentEducation,
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.degree',
          title: educationMessages.labels.schoolDegreeLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (
            application: Application,
            field: Field,
            locale: Locale,
          ) => {
            const hasCurrentProgram = hasCurrentOrRecentEducation(
              application.answers,
            )
            if (!hasCurrentProgram) {
              return ''
            }
            const degreeAnswer =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.degree',
              ) ?? ''
            const education =
              getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.educationPrograms',
              ) ?? []
            let degreeValue:
              | GaldurDomainModelsEducationEducationDegreeDTO
              | undefined

            education?.forEach((program) => {
              return program.degrees?.forEach((degree) => {
                const match = degree.id === degreeAnswer
                if (match) {
                  degreeValue = degree
                }
              })
            })
            return degreeValue
              ? locale === 'is'
                ? degreeValue.name
                : degreeValue.english
              : ''
          },
          condition: hasCurrentOrRecentEducation,
        }),
        buildTextField({
          id: 'educationHistory.currentStudies.units',
          title: educationMessages.labels.schoolProgramUnitsLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const hasCurrentProgram = hasCurrentOrRecentEducation(
              application.answers,
            )
            if (!hasCurrentProgram) {
              return ''
            }
            const units =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.units',
              ) ?? ''
            return units
          },
          condition: hasCurrentOrRecentEducation,
        }),

        buildTextField({
          id: 'educationHistory.currentStudies.endDate',
          title: educationMessages.labels.expectedEndOfStudyLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const hasCurrentProgram = hasCurrentOrRecentEducation(
              application.answers,
            )
            if (!hasCurrentProgram) {
              return ''
            }
            const expectedEndOfStudy =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.endDate',
              ) ?? ''
            return formatDate(expectedEndOfStudy)
          },
          condition: hasCurrentOrRecentEducation,
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
            endOfStudy: {
              label: educationMessages.labels.endOfStudies,
              component: 'select',
              placeholder: educationMessages.labels.endOfStudiesPlaceholder,
              options: () => {
                const currentYear = new Date().getFullYear()
                const years = Array.from({ length: 51 }, (_, i) => {
                  const year = (currentYear - i).toString()
                  return { value: year, label: year }
                })
                return years
              },
            },
          },
        }),
      ],
    }),
  ],
})
