import {
  buildAlertMessageField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Application } from '@island.is/application/types'
import { oldAgePensionFormMessage } from '../../lib/messages'
import {
  getApplicationAnswers,
  getAvailableMonths,
  getAvailableYears,
} from '../../utils/oldAgePensionUtils'
import { isEarlyRetirement } from '../../utils/conditionUtils'

export const periodSection = buildSection({
  id: 'periodSection',
  title: socialInsuranceAdministrationMessage.period.overviewTitle,
  children: [
    // Period is from 65 year old birthday or last
    // 2 years if applicant is 67+ to 6 month ahead
    buildMultiField({
      id: 'periodField',
      title: socialInsuranceAdministrationMessage.period.title,
      description: oldAgePensionFormMessage.period.periodDescription,
      children: [
        buildSelectField({
          id: 'period.year',
          title: socialInsuranceAdministrationMessage.period.year,
          width: 'half',
          placeholder:
            socialInsuranceAdministrationMessage.period.yearDefaultText,
          options: (application: Application) => getAvailableYears(application),
        }),
        buildSelectField({
          id: 'period.month',
          title: socialInsuranceAdministrationMessage.period.month,
          width: 'half',
          placeholder:
            socialInsuranceAdministrationMessage.period.monthDefaultText,
          options: (application: Application) => {
            const { selectedYear } = getApplicationAnswers(application.answers)

            return getAvailableMonths(application, selectedYear)
          },
          condition: (answers) => {
            const { selectedYear, selectedYearHiddenInput } =
              getApplicationAnswers(answers)

            return selectedYear === selectedYearHiddenInput
          },
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on options in the select above
          id: 'period.hiddenInput',
          watchValue: 'period.year',
        }),
        buildAlertMessageField({
          id: 'period.alert',
          title: socialInsuranceAdministrationMessage.shared.alertTitle,
          message: oldAgePensionFormMessage.period.periodAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'warning',
          links: [
            {
              title: oldAgePensionFormMessage.period.periodAlertLinkTitle,
              url: oldAgePensionFormMessage.period.periodAlertUrl,
              isExternal: true,
            },
          ],
          condition: (answers, externalData) =>
            isEarlyRetirement(answers, externalData),
        }),
      ],
    }),
  ],
})
