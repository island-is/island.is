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
import { GaldurDomainModelsEducationItem } from '@island.is/clients/vmst-unemployment'
import { formatDate } from '../../../utils'

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
              getValueViaPath<GaldurDomainModelsEducationItem[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.education',
              ) ?? []
            console.log(programId, education)
            const program = education.find((item) => item.id === programId)
            console.log(program)
            return program?.name ?? ''
          },
          condition: (_answers, _externalData) => {
            // TODO: Get info from externalData if available
            return true
          },
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
          condition: (_answers, _externalData) => {
            // TODO: Get info from externalData if available
            return true
          },
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
          condition: (_answers, _externalData) => {
            // TODO: Get info from externalData if available
            return true
          },
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
          condition: (_answers, _externalData) => {
            // TODO: Get info from externalData if available
            return true
          },
        }),
        buildFieldsRepeaterField({
          id: 'educationHistory.educationHistory',
          formTitle: (index, _application) => {
            // TODO: Get info from externalData about currentStudies
            return {
              ...employmentSearchMessages.educationHistory
                .educationHistoryTitle,
              values: {
                value: index + 2, // TODO: If no current studies then do + 1
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
                const education = getValueViaPath<
                  GaldurDomainModelsEducationItem[]
                >(
                  application.externalData,
                  'unemploymentApplication.data.supportData.education',
                )
                return (
                  education
                    ?.filter((level) => level.level === 1)
                    .map((level) => ({
                      value: level.id ?? '',
                      label:
                        (locale === 'is'
                          ? level.name
                          : level.english ?? level.name) || '',
                    })) ?? []
                )
              },
            },
            degree: {
              label: employmentSearchMessages.educationHistory.degreeLabel,
              component: 'select',
              options: (application, activeField, locale) => {
                const education = getValueViaPath<
                  GaldurDomainModelsEducationItem[]
                >(
                  application.externalData,
                  'unemploymentApplication.data.supportData.education',
                )
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                return (
                  education
                    ?.filter(
                      (level) =>
                        level.level === 2 && level.parentId === levelOfStudy,
                    )
                    .map((level) => ({
                      value: level.id ?? '',
                      label:
                        (locale === 'is'
                          ? level.name
                          : level.english ?? level.name) || '',
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
                  GaldurDomainModelsEducationItem[]
                >(
                  application.externalData,
                  'unemploymentApplication.data.supportData.education',
                )
                const levelOfStudy = (activeField?.levelOfStudy as string) ?? ''
                const degree = (activeField?.degree as string) ?? ''
                return (
                  education
                    ?.find(
                      (level) =>
                        level.level === 2 &&
                        level.parentId === levelOfStudy &&
                        level.id === degree,
                    )
                    ?.relations?.map((relation) => ({
                      value: relation.code ?? '',
                      label: relation.name ?? '',
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
