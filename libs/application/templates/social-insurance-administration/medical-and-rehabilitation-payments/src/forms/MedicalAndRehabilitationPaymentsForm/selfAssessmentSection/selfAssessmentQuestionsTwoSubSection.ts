import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelfAssessmentLastEmploymentYearOptions,
  getApplicationExternalData,
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
            const { employmentStatuses } = getApplicationExternalData(
              application.externalData,
            )

            const statuses =
              employmentStatuses.find(
                (status) => status.languageCode.toLowerCase() === locale,
              )?.employmentStatuses ?? []

            const options =
              statuses?.map(({ value, displayName }) => ({
                value: value,
                label: displayName,
              })) ?? []

            const otherIndex = options.findIndex(
              (option) => option.value === 'ANNAD',
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

            return currentEmploymentStatuses?.includes('ANNAD')
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
