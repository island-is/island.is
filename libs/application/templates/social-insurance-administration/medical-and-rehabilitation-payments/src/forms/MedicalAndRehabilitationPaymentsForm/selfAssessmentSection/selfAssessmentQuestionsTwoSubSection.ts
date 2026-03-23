import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { OTHER } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getEmploymentStatuses,
  getSelfAssessmentLastProfessionYearOptions,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const selfAssessmentQuestionsTwoSubSection = buildSubSection({
  id: 'selfAssessmentQuestionsTwoSubSection',
  tabTitle:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    buildMultiField({
      id: 'selfAssessmentQuestionsTwo',
      title:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
      children: [
        buildCheckboxField({
          id: 'selfAssessmentQuestionsTwo.currentEmploymentStatuses',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .currentEmploymentStatusTitle,
          required: true,
          options: (application, _, locale) => {
            const statuses = getEmploymentStatuses(
              application.externalData,
              locale,
            )

            const options =
              statuses?.map(({ value, displayName }) => ({
                value: value,
                label: displayName,
              })) ?? []

            const otherIndex = options.findIndex(
              (option) => option.value === OTHER,
            )

            if (otherIndex >= 0) {
              options.push(options.splice(otherIndex, 1)[0])
            }

            return options
          },
        }),
        buildTextField({
          id: 'selfAssessmentQuestionsTwo.currentEmploymentStatusExplanation',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .furtherExplanation,
          condition: (answers) => {
            const { currentEmploymentStatuses } = getApplicationAnswers(answers)

            return currentEmploymentStatuses?.includes(OTHER)
          },
        }),
        buildDescriptionField({
          id: 'selfAssessmentQuestionsTwo.lastProfession.title',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastProfessionTitle,
          titleVariant: 'h4',
          space: 4,
        }),
        buildSelectField({
          id: 'selfAssessmentQuestionsTwo.lastProfession',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.jobTitle,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastProfessionPlaceholder,
          options: (application: Application) => {
            const { professions } = getApplicationExternalData(
              application.externalData,
            )

            return professions.map(({ value, description }) => ({
              value: value,
              label: description,
            }))
          },
        }),
        buildTextField({
          id: 'selfAssessmentQuestionsTwo.lastProfessionDescription',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .furtherExplanation,
          marginBottom: 2,
          condition: (answers) => {
            const { lastProfession } = getApplicationAnswers(answers)

            return lastProfession === OTHER
          },
        }),
        buildSelectField({
          id: 'selfAssessmentQuestionsTwo.lastActivityOfProfession',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastActivityOfProfession,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastActivityOfProfessionPlaceholder,
          options: (application: Application) => {
            const { activitiesOfProfessions } = getApplicationExternalData(
              application.externalData,
            )

            return activitiesOfProfessions.map(({ value, description }) => ({
              value: value,
              label: description,
            }))
          },
        }),
        buildTextField({
          id: 'selfAssessmentQuestionsTwo.lastActivityOfProfessionDescription',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .furtherExplanation,
          marginBottom: 2,
          condition: (answers) => {
            const { lastActivityOfProfession } = getApplicationAnswers(answers)

            return lastActivityOfProfession === OTHER
          },
        }),
        buildSelectField({
          id: 'selfAssessmentQuestionsTwo.lastProfessionYear',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastProfessionYear,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastProfessionYearPlaceholder,
          options: getSelfAssessmentLastProfessionYearOptions(),
        }),
      ],
    }),
  ],
})
