import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { SelfAssessmentCurrentEmploymentStatus } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getSelfAssessmentCurrentEmploymentStatusOptions,
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
          id: 'selfAssessment.currentEmploymentStatus',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .currentEmploymentStatusTitle,
          required: true,
          options: getSelfAssessmentCurrentEmploymentStatusOptions(),
        }),
        buildTextField({
          id: 'selfAssessment.currentEmploymentStatusAdditional',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .furtherExplanation,
          condition: (answers) => {
            const { currentEmploymentStatus } = getApplicationAnswers(answers)
            return currentEmploymentStatus?.includes(
              SelfAssessmentCurrentEmploymentStatus.OTHER,
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
