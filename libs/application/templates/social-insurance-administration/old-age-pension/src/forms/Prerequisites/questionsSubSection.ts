import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubmitField,
  buildSubSection,
  NO,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { DefaultEvents } from '@island.is/application/types'
import { oldAgePensionFormMessage } from '../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../utils/oldAgePensionUtils'

export const questionsSubSection = buildSubSection({
  id: 'questionsSubSection',
  title: oldAgePensionFormMessage.pre.questionTitle,
  condition: (_, externalData) => {
    const { isEligible } = getApplicationExternalData(externalData)
    // Show if applicant is eligible
    return isEligible
  },
  children: [
    buildMultiField({
      id: 'questions',
      title: oldAgePensionFormMessage.pre.questionTitle,
      description: oldAgePensionFormMessage.pre.pensionFundQuestionDescription,
      children: [
        buildRadioField({
          id: 'questions.pensionFund',
          options: getYesNoOptions(),
          width: 'half',
        }),
        buildAlertMessageField({
          id: 'question.pensionFundAlert',
          title: socialInsuranceAdministrationMessage.shared.alertTitle,
          message: oldAgePensionFormMessage.pre.pensionFundAlertDescription,
          doesNotRequireAnswer: true,
          alertType: 'error',
          condition: (answers) => {
            const { pensionFundQuestion } = getApplicationAnswers(answers)

            return pensionFundQuestion === NO
          },
        }),
        buildSubmitField({
          id: 'toDraft',
          title: oldAgePensionFormMessage.pre.confirmationTitle,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: socialInsuranceAdministrationMessage.pre.startApplication,
              type: 'primary',
              condition: (answers) => {
                const { pensionFundQuestion } = getApplicationAnswers(answers)

                return pensionFundQuestion !== NO
              },
            },
          ],
        }),
      ],
    }),
  ],
})
