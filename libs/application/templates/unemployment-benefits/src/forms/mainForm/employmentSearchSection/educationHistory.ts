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
import { application } from 'express'
import { Application } from '@island.is/application/types'

export const educationHistorySubSection = buildSubSection({
  id: 'educationHistorySubSection',
  title: employmentSearchMessages.educationHistory.sectionTitle,
  children: [
    buildMultiField({
      id: 'educationHistorySubSection',
      title: employmentSearchMessages.educationHistory.pageTitle,
      children: [
        buildDescriptionField({
          id: 'currentStudies.description',
          title: employmentSearchMessages.educationHistory.currentStudiesLabel,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'currentStudies.schoolName',
          title: employmentSearchMessages.educationHistory.schoolNameLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const schoolName = getValueViaPath<string>(
              application.externalData,
              'schoolName',
            )
            return schoolName ?? 'Háskóli Íslands'
          },
          condition: (_answers, _externalData) => {
            // Get info from externalData if available
            return true
          },
        }),
        buildTextField({
          id: 'currentStudies.courseSubject',
          title: employmentSearchMessages.educationHistory.courseSubjectLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const courseSubject = getValueViaPath<string>(
              application.externalData,
              'courseSubject',
            )
            return courseSubject ?? 'Verkfræði'
          },
          condition: (_answers, _externalData) => {
            // Get info from externalData if available
            return true
          },
        }),
        buildTextField({
          id: 'currentStudies.units',
          title: employmentSearchMessages.educationHistory.unitsLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const units = getValueViaPath<string>(
              application.externalData,
              'units',
            )
            return units ?? '20'
          },
          condition: (_answers, _externalData) => {
            // Get info from externalData if available
            return true
          },
        }),
        buildTextField({
          id: 'currentStudies.degree',
          title: employmentSearchMessages.educationHistory.degreeLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const degree = getValueViaPath<string>(
              application.externalData,
              'degree',
            )
            return degree ?? 'BS'
          },
          condition: (_answers, _externalData) => {
            // Get info from externalData if available
            return true
          },
        }),
        buildTextField({
          id: 'currentStudies.expectedEndOfStudy',
          title:
            employmentSearchMessages.educationHistory.expectedEndOfStudyLabel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            const expectedEndOfStudy = getValueViaPath<string>(
              application.externalData,
              'expectedEndOfStudy',
            )
            return expectedEndOfStudy ?? '01.06.2024'
          },
          condition: (_answers, _externalData) => {
            // Get info from externalData if available
            return true
          },
        }),
        buildFieldsRepeaterField({
          id: 'educationHistory',
          formTitle: (index) => {
            return {
              ...employmentSearchMessages.educationHistory
                .educationHistoryTitle,
              values: {
                value: index + 2,
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
              options: (application) => {
                const levelsOfStudy = getValueViaPath<{ name: string }[]>(
                  application.externalData,
                  'levelsOfStudy',
                ) ?? [
                  {
                    name: 'Framhaldsskóli',
                  },
                  {
                    name: 'Háskóli BSc.',
                  },
                  {
                    name: 'Háskóli MSc.',
                  },
                ]
                return levelsOfStudy.map((level) => ({
                  value: level.name,
                  label: level.name,
                }))
              },
            },
            degree: {
              label: employmentSearchMessages.educationHistory.degreeLabel,
              component: 'select',
              options: (application) => {
                const degrees = getValueViaPath<{ name: string }[]>(
                  application.externalData,
                  'degrees',
                ) ?? [
                  {
                    name: 'Strúdentspróf',
                  },
                  {
                    name: 'Háskólapróf',
                  },
                ]
                return degrees.map((degree) => ({
                  value: degree.name,
                  label: degree.name,
                }))
              },
            },
            courseOfStudy: {
              label:
                employmentSearchMessages.educationHistory.courseOfStudyLabel,
              component: 'select',
              options: (application) => {
                const coursesOfStudy = getValueViaPath<{ name: string }[]>(
                  application.externalData,
                  'coursesOfStudy',
                ) ?? [
                  {
                    name: 'Stærðfræðibraut',
                  },
                  {
                    name: 'Raunvísindabraut',
                  },
                  {
                    name: 'Heimspeki',
                  },
                ]
                return coursesOfStudy.map((level) => ({
                  value: level.name,
                  label: level.name,
                }))
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
