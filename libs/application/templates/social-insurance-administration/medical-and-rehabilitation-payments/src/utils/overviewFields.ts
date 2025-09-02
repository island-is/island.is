import { buildOverviewField } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  isFirstApplication,
  shouldShowConfirmationOfIllHealth,
  shouldShowConfirmationOfPendingResolution,
  shouldShowConfirmedTreatment,
  shouldShowRehabilitationPlan,
} from './conditionUtils'
import { getApplicationAnswers } from './medicalAndRehabilitationPaymentsUtils'
import {
  applicantItems,
  benefitsFromAnotherCountryItems,
  benefitsFromAnotherCountryTable,
  commentItems,
  confirmationOfIllHealthItems,
  confirmationOfPendingResolutionItems,
  confirmedTreatmentItems,
  employeeSickPayItems,
  incomePlanTable,
  paymentItems,
  questionsItems,
  rehabilitationPlanItems,
  selfAssessmentQuestionnaireItems,
  selfAssessmentQuestionsOneItems,
  selfAssessmentQuestionsThreeItems,
  selfAssessmentQuestionsTwoItems,
  unionSickPayItems,
} from './overviewItems'

export const overviewFields = (editable?: boolean) => {
  return [
    buildOverviewField({
      id: 'overview.applicantInfo',
      backId: editable ? 'applicantInfo' : undefined,
      items: applicantItems,
    }),
    buildOverviewField({
      id: 'overview.paymentInfo',
      backId: editable ? 'paymentInfo' : undefined,
      items: paymentItems,
    }),
    buildOverviewField({
      id: 'overview.incomePlanTable',
      title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
      backId: editable ? 'incomePlanTable' : undefined,
      tableData: incomePlanTable,
    }),
    buildOverviewField({
      id: 'overview.benefitsFromAnotherCountry',
      backId: editable ? 'benefitsFromAnotherCountry' : undefined,
      items: benefitsFromAnotherCountryItems,
      tableData: benefitsFromAnotherCountryTable,
      condition: (_, externalData) => isFirstApplication(externalData),
    }),
    buildOverviewField({
      id: 'overview.questions',
      backId: editable ? 'questions' : undefined,
      items: questionsItems,
    }),
    buildOverviewField({
      id: 'overview.employeeSickPay',
      backId: editable ? 'employeeSickPay' : undefined,
      items: employeeSickPayItems,
      condition: (_, externalData) => isFirstApplication(externalData),
    }),
    buildOverviewField({
      id: 'overview.unionSickPay',
      backId: editable ? 'unionSickPay' : undefined,
      loadItems: unionSickPayItems,
      condition: (_, externalData) => isFirstApplication(externalData),
    }),
    buildOverviewField({
      id: 'overview.rehabilitationPlan',
      items: rehabilitationPlanItems,
      condition: (_, externalData) =>
        shouldShowRehabilitationPlan(externalData),
    }),
    buildOverviewField({
      id: 'overview.confirmedTreatment',
      items: confirmedTreatmentItems,
      condition: (_, externalData) =>
        shouldShowConfirmedTreatment(externalData),
    }),
    buildOverviewField({
      id: 'overview.confirmationOfPendingResolution',
      items: confirmationOfPendingResolutionItems,
      condition: (_, externalData) =>
        shouldShowConfirmationOfPendingResolution(externalData),
    }),
    buildOverviewField({
      id: 'overview.confirmationOfIllHealth',
      items: confirmationOfIllHealthItems,
      condition: (_, externalData) =>
        shouldShowConfirmationOfIllHealth(externalData),
    }),
    buildOverviewField({
      id: 'overview.selfAssessmentQuestionsOne',
      backId: editable ? 'selfAssessmentQuestionsOne' : undefined,
      items: selfAssessmentQuestionsOneItems,
    }),
    buildOverviewField({
      id: 'overview.selfAssessmentQuestionsTwo',
      backId: editable ? 'selfAssessmentQuestionsTwo' : undefined,
      items: selfAssessmentQuestionsTwoItems,
    }),
    buildOverviewField({
      id: 'overview.selfAssessmentQuestionsThree',
      backId: editable ? 'selfAssessmentQuestionsThree' : undefined,
      items: selfAssessmentQuestionsThreeItems,
    }),
    buildOverviewField({
      id: 'overview.selfAssessmentQuestionnaire',
      backId: editable ? 'selfAssessment.questionnaire[0]' : undefined,
      items: selfAssessmentQuestionnaireItems,
    }),
    buildOverviewField({
      id: 'overview.comment',
      backId: editable ? 'comment' : undefined,
      items: commentItems,
      condition: (answers) => {
        const { comment } = getApplicationAnswers(answers)
        return !!comment
      },
    }),
  ]
}
