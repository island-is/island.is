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
import { getApplicationAnswers } from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const selfAssessmentQuestionsThreeSubSection = buildSubSection({
  id: 'selfAssessmentQuestionsThreeSubSection',
  tabTitle:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    buildMultiField({
      id: 'selfAssessmentQuestionsThree',
      title:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .sectionDescription,
      children: [
        buildDescriptionField({
          id: 'selfAssessment.mainProblemDescriptionField',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .mainProblemTitle,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'selfAssessment.mainProblem',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .mainProblem,
        }),
        buildRadioField({
          id: 'selfAssessment.hasPreviouslyReceivedRehabilitationOrTreatment',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .hasPreviouslyReceivedRehabilitationOrTreatment,
          options: getYesNoOptions(),
          required: true,
          width: 'half',
          space: 4,
        }),
        buildTextField({
          id: 'selfAssessment.previousRehabilitationOrTreatment',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .previousRehabilitationOrTreatment,
          condition: (answers) => {
            const { hasPreviouslyReceivedRehabilitationOrTreatment } =
              getApplicationAnswers(answers)
            return hasPreviouslyReceivedRehabilitationOrTreatment === YES
          },
        }),
        buildRadioField({
          id: 'selfAssessment.previousRehabilitationSuccessful',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .previousRehabilitationSuccessful,
          options: getYesNoOptions(),
          required: true,
          width: 'half',
          space: 4,
          condition: (answers) => {
            const { hasPreviouslyReceivedRehabilitationOrTreatment } =
              getApplicationAnswers(answers)
            return hasPreviouslyReceivedRehabilitationOrTreatment === YES
          },
        }),
        buildTextField({
          id: 'selfAssessment.previousRehabilitationSuccessfulFurtherExplanations',
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
