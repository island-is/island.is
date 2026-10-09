import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/oldAgePensionUtils'

export const onePaymentPerYearSubSection = buildSubSection({
  id: 'onePaymentPerYearSubSection',
  title: oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
  children: [
    buildMultiField({
      id: 'onePaymentPerYear',
      title: oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
      description:
        oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearDescription,
      children: [
        buildRadioField({
          id: 'onePaymentPerYear.question',
          options: getYesNoOptions(),
          defaultValue: NO,
          width: 'half',
        }),
        buildAlertMessageField({
          id: 'onePaymentPerYear.alert',
          title: socialInsuranceAdministrationMessage.shared.alertTitle,
          message:
            oldAgePensionFormMessage.onePaymentPerYear
              .onePaymentPerYearAlertDescription,
          doesNotRequireAnswer: true,
          alertType: 'warning',
          condition: (answers) => {
            const { onePaymentPerYear } = getApplicationAnswers(answers)

            return onePaymentPerYear === YES
          },
        }),
      ],
    }),
  ],
})
