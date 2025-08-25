import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { academicBackground } from '../../lib/messages'
import { GaldurDomainModelsEducationProgramDTO } from '@island.is/clients/vmst-unemployment'

export const academicBackgroundSection = buildSection({
  id: 'academicBackgroundSection',
  title: academicBackground.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'academicBackgroundMultiField',
      title: academicBackground.general.pageTitle,
      description: academicBackground.general.description,
      children: [
        buildFieldsRepeaterField({
          id: 'academicBackground.education',
          formTitle: academicBackground.labels.education,
          formTitleNumbering: 'suffix',
          minRows: 0,
          addItemButtonText: academicBackground.labels.addEducationButton,
          fields: {
            levelOfStudy: {
              label: academicBackground.labels.levelOfStudy,
              component: 'select',
              required: true,
              options: (application, _, locale) => {
                const education =
                  getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                    application.externalData,
                    'activityGrantApplication.data.activationGrant.supportData.educationPrograms',
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
              label: academicBackground.labels.degree,
              component: 'select',
              required: true,
              options: (application, activeField, locale) => {
                const education =
                  getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                    application.externalData,
                    'activityGrantApplication.data.activationGrant.supportData.educationPrograms',
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
            subject: {
              label: academicBackground.labels.subject,
              component: 'select',
              options: (application, activeField) => {
                const education = getValueViaPath<
                  GaldurDomainModelsEducationProgramDTO[]
                >(
                  application.externalData,
                  'activityGrantApplication.data.activationGrant.supportData.educationPrograms',
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
              label: academicBackground.labels.endOfStudies,
              component: 'select',
              placeholder: academicBackground.labels.endOfStudiesPlaceholder,
              required: true,
              disabled: (_application, activeField) => {
                const isNotFinished =
                  activeField?.isStillStudying as unknown as Array<string>
                if (!isNotFinished || isNotFinished.length < 1) return false
                if (isNotFinished[0] === YES) return true
                return false
              },
              options: () => {
                const currentYear = new Date().getFullYear()
                const years = Array.from({ length: 51 }, (_, i) => {
                  const year = (currentYear - i).toString()
                  return { value: year, label: year }
                })
                return years
              },
            },
            isStillStudying: {
              component: 'checkbox',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label: academicBackground.labels.currentlyStudying,
                },
              ],
              clearOnChange: (index: number) => [
                `academicBackground.education[${index}].endOfStudy`,
              ],
            },
          },
        }),
      ],
    }),
  ],
})
