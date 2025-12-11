import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { shouldShowPreviousRehabilitationOrTreatmentFields } from '../../../utils/conditionUtils'
import { getApplicationAnswers } from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const selfAssessmentQuestionsThreeSubSection = buildSubSection({
  id: 'selfAssessmentQuestionsThreeSubSection',
  tabTitle:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    buildMultiField({
      id: 'selfAssessmentQuestionsThree',
      title:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'selfAssessmentQuestionsThree.mainProblemDescriptionField',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .mainProblemTitle,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'selfAssessmentQuestionsThree.mainProblem',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .mainProblem,
        }),
        buildRadioField({
          id: 'selfAssessmentQuestionsThree.hasPreviouslyReceivedRehabilitationOrTreatment',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .hasPreviouslyReceivedRehabilitationOrTreatment,
          options: getYesNoOptions(),
          required: true,
          width: 'half',
          space: 4,
        }),
        buildTextField({
          id: 'selfAssessmentQuestionsThree.previousRehabilitationOrTreatment',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .previousRehabilitationOrTreatment,
          condition: (answers) =>
            shouldShowPreviousRehabilitationOrTreatmentFields(answers),
        }),
        buildRadioField({
          id: 'selfAssessmentQuestionsThree.previousRehabilitationSuccessful',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .previousRehabilitationSuccessful,
          options: getYesNoOptions(),
          required: true,
          width: 'half',
          space: 4,
          condition: (answers) =>
            shouldShowPreviousRehabilitationOrTreatmentFields(answers),
        }),
        buildTextField({
          id: 'selfAssessmentQuestionsThree.previousRehabilitationSuccessfulFurtherExplanations',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .previousRehabilitationSuccessfulFurtherExplanations,
          condition: (answers) => {
            const {
              hasPreviouslyReceivedRehabilitationOrTreatment,
              previousRehabilitationSuccessful,
            } = getApplicationAnswers(answers)
            return (
              hasPreviouslyReceivedRehabilitationOrTreatment === YES &&
              (previousRehabilitationSuccessful === YES ||
                previousRehabilitationSuccessful === NO)
            )
          },
        }),
      ],
    }),
  ],
})
