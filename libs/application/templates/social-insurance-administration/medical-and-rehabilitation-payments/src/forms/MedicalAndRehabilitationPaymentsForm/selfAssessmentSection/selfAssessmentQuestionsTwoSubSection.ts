import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { CURRENT_EMPLOYMENT_STATUS_OTHER } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getEmploymentStatuses,
  getSelfAssessmentLastEmploymentYearOptions,
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
          id: 'selfAssessment.currentEmploymentStatuses',
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
              (option) => option.value === CURRENT_EMPLOYMENT_STATUS_OTHER,
            )

            if (otherIndex >= 0) {
              options.push(options.splice(otherIndex, 1)[0])
            }

            return options
          },
        }),
        buildTextField({
          id: 'selfAssessment.currentEmploymentStatusExplanation',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .furtherExplanation,
          condition: (answers) => {
            const { currentEmploymentStatuses } = getApplicationAnswers(answers)

            return currentEmploymentStatuses?.includes(
              CURRENT_EMPLOYMENT_STATUS_OTHER,
            )
          },
        }),
        buildDescriptionField({
          id: 'selfAssessment.lastEmployment.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastEmployment,
          titleVariant: 'h4',
          space: 4,
        }),
        buildTextField({
          id: 'selfAssessment.lastEmploymentTitle',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.jobTitle,
        }),
        buildSelectField({
          id: 'selfAssessment.lastEmploymentYear',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastEmploymentYear,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .lastEmploymentYearPlaceholder,
          options: getSelfAssessmentLastEmploymentYearOptions(),
        }),
      ],
    }),
  ],
})
