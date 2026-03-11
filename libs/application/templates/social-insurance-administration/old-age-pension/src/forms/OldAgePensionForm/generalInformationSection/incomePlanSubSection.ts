import {
  buildAlertMessageField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import {
  DIVIDENDS_IN_FOREIGN_BANKS,
  FOREIGN_BASIC_PENSION,
  FOREIGN_INCOME,
  FOREIGN_PENSION,
  INCOME,
  INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
  ISK,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { generateMonthInput } from '@island.is/application/templates/social-insurance-administration-core/lib/generateMonthInput'
import {
  equalIncomePerMonthValueModifier,
  incomePerYearValueModifier,
  incomePerYearWatchValues,
  incomePlanHasOnlyZeroIncome,
  incomeTypeValueModifier,
} from '@island.is/application/templates/social-insurance-administration-core/lib/incomePlanUtils'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getCategoriesOptions,
  getCurrencies,
  getTypesOptions,
  getYesNoOptions,
  shouldShowEqualIncomePerMonth,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'
import { RatioType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../utils/oldAgePensionUtils'

export const incomePlanSubSection = buildSubSection({
  id: 'incomePlanSubSection',
  title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
  children: [
    buildMultiField({
      id: 'incomePlan',
      title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
      children: [
        buildTableRepeaterField({
          id: 'incomePlanTable',
          description: (application: Application) => {
            const { incomePlanConditions } = getApplicationExternalData(
              application.externalData,
            )

            return {
              ...socialInsuranceAdministrationMessage.incomePlan.description,
              values: {
                incomePlanYear:
                  incomePlanConditions?.incomePlanYear ??
                  new Date().getFullYear(),
              },
            }
          },
          formTitle:
            socialInsuranceAdministrationMessage.incomePlan.registerIncome,
          addItemButtonText:
            socialInsuranceAdministrationMessage.incomePlan.addIncome,
          saveItemButtonText:
            socialInsuranceAdministrationMessage.incomePlan.saveIncome,
          editField: true,
          editButtonTooltipText:
            socialInsuranceAdministrationMessage.incomePlan.editIncome,
          removeButtonTooltipText:
            socialInsuranceAdministrationMessage.incomePlan.removeIncome,
          marginTop: 0,
          fields: {
            incomeCategory: {
              component: 'select',
              label:
                socialInsuranceAdministrationMessage.incomePlan.incomeCategory,
              placeholder:
                socialInsuranceAdministrationMessage.incomePlan
                  .selectIncomeCategory,
              displayInTable: false,
              width: 'half',
              isSearchable: true,
              options: (application) => {
                const { categorizedIncomeTypes } = getApplicationExternalData(
                  application.externalData,
                )

                return getCategoriesOptions(categorizedIncomeTypes)
              },
            },
            incomeType: {
              component: 'select',
              label: socialInsuranceAdministrationMessage.incomePlan.incomeType,
              placeholder:
                socialInsuranceAdministrationMessage.incomePlan
                  .selectIncomeType,
              width: 'half',
              isSearchable: true,
              updateValueObj: {
                valueModifier: (application, activeField) => {
                  const { categorizedIncomeTypes } = getApplicationExternalData(
                    application.externalData,
                  )
                  return incomeTypeValueModifier(
                    categorizedIncomeTypes,
                    activeField,
                  )
                },
                watchValues: 'incomeCategory',
              },
              options: (application, activeField) => {
                const { categorizedIncomeTypes } = getApplicationExternalData(
                  application.externalData,
                )

                return getTypesOptions(
                  categorizedIncomeTypes,
                  activeField?.incomeCategory,
                )
              },
            },
            currency: {
              component: 'select',
              label: socialInsuranceAdministrationMessage.incomePlan.currency,
              placeholder:
                socialInsuranceAdministrationMessage.incomePlan.selectCurrency,
              isSearchable: true,
              options: (application, activeField) => {
                const { currencies } = getApplicationExternalData(
                  application.externalData,
                )
                const hideISKCurrency =
                  activeField?.incomeType === FOREIGN_BASIC_PENSION ||
                  activeField?.incomeType === FOREIGN_PENSION ||
                  activeField?.incomeType === FOREIGN_INCOME ||
                  activeField?.incomeType ===
                    INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS ||
                  activeField?.incomeType === DIVIDENDS_IN_FOREIGN_BANKS
                    ? ISK
                    : ''

                return getCurrencies(currencies, hideISKCurrency)
              },
            },
            income: {
              component: 'radio',
              displayInTable: false,
              largeButtons: false,
              options: [
                {
                  value: RatioType.YEARLY,
                  label:
                    socialInsuranceAdministrationMessage.incomePlan
                      .annualIncome,
                },
                {
                  value: RatioType.MONTHLY,
                  label:
                    socialInsuranceAdministrationMessage.incomePlan
                      .monthlyIncome,
                },
              ],
            },
            equalForeignIncomePerMonth: {
              component: 'input',
              label:
                socialInsuranceAdministrationMessage.incomePlan
                  .equalForeignIncomePerMonth,
              width: 'half',
              type: 'number',
              displayInTable: false,
              currency: true,
              updateValueObj: {
                valueModifier: (_, activeField) =>
                  equalIncomePerMonthValueModifier(true, activeField),
                watchValues: ['income', 'currency', 'unevenIncomePerYear'],
              },
              suffix: '',
              condition: (_, activeField) =>
                shouldShowEqualIncomePerMonth(true, activeField),
            },
            equalIncomePerMonth: {
              component: 'input',
              label:
                socialInsuranceAdministrationMessage.incomePlan
                  .equalIncomePerMonth,
              width: 'half',
              type: 'number',
              displayInTable: false,
              currency: true,
              updateValueObj: {
                valueModifier: (_, activeField) =>
                  equalIncomePerMonthValueModifier(false, activeField),
                watchValues: ['income', 'currency', 'unevenIncomePerYear'],
              },
              suffix: '',
              condition: (_, activeField) =>
                shouldShowEqualIncomePerMonth(false, activeField),
            },
            incomePerYear: {
              component: 'input',
              label:
                socialInsuranceAdministrationMessage.incomePlan.incomePerYear,
              width: 'half',
              type: 'number',
              currency: true,
              disabled: (_, activeField) =>
                activeField?.income === RatioType.MONTHLY,
              updateValueObj: {
                valueModifier: (_, activeField) =>
                  incomePerYearValueModifier(activeField),
                watchValues: incomePerYearWatchValues,
              },
              suffix: '',
              condition: (_, activeField) =>
                activeField?.income === RatioType.YEARLY ||
                activeField?.income === RatioType.MONTHLY,
            },
            unevenIncomePerYear: {
              component: 'checkbox',
              large: true,
              width: 'full',
              options: [
                {
                  value: YES,
                  label:
                    socialInsuranceAdministrationMessage.incomePlan
                      .monthlyDistributionOfIncome,
                  tooltip:
                    socialInsuranceAdministrationMessage.incomePlan
                      .monthlyDistributionOfIncomeTooltip,
                },
              ],
              backgroundColor: 'blue',
              displayInTable: false,
              condition: (_, activeField) =>
                activeField?.income === RatioType.MONTHLY &&
                activeField?.incomeCategory === INCOME,
            },
            january: generateMonthInput(
              socialInsuranceAdministrationMessage.months.january,
            ),
            february: generateMonthInput(
              socialInsuranceAdministrationMessage.months.february,
            ),
            march: generateMonthInput(
              socialInsuranceAdministrationMessage.months.march,
            ),
            april: generateMonthInput(
              socialInsuranceAdministrationMessage.months.april,
            ),
            may: generateMonthInput(
              socialInsuranceAdministrationMessage.months.may,
            ),
            june: generateMonthInput(
              socialInsuranceAdministrationMessage.months.june,
            ),
            july: generateMonthInput(
              socialInsuranceAdministrationMessage.months.july,
            ),
            august: generateMonthInput(
              socialInsuranceAdministrationMessage.months.august,
            ),
            september: generateMonthInput(
              socialInsuranceAdministrationMessage.months.september,
            ),
            october: generateMonthInput(
              socialInsuranceAdministrationMessage.months.october,
            ),
            november: generateMonthInput(
              socialInsuranceAdministrationMessage.months.november,
            ),
            december: generateMonthInput(
              socialInsuranceAdministrationMessage.months.desember,
            ),
          },
          table: {
            format: {
              incomePerYear: (value) =>
                value && formatCurrencyWithoutSuffix(value),
            },
            header: [
              socialInsuranceAdministrationMessage.incomePlan.incomeType,
              socialInsuranceAdministrationMessage.incomePlan.incomePerYear,
              socialInsuranceAdministrationMessage.incomePlan.currency,
            ],
            rows: ['incomeType', 'incomePerYear', 'currency'],
          },
        }),
        buildHiddenInput({
          id: 'incomePlan.shouldShow',
          defaultValue: (application: Application) => {
            const { incomePlan } = getApplicationAnswers(application.answers)
            return incomePlanHasOnlyZeroIncome(incomePlan)
          },
        }),
        buildAlertMessageField({
          id: 'incomePlan.alertMessage',
          title: socialInsuranceAdministrationMessage.shared.alertTitle,
          message: socialInsuranceAdministrationMessage.incomePlan.alertMessage,
          doesNotRequireAnswer: true,
          alertType: 'warning',
          marginTop: 4,
          condition: (answers) => {
            const { incomePlan } = getApplicationAnswers(answers)
            return incomePlanHasOnlyZeroIncome(incomePlan)
          },
        }),
        buildRadioField({
          id: 'incomePlan.noOtherIncomeConfirmation',
          title:
            socialInsuranceAdministrationMessage.incomePlan
              .noOtherIncomeConfirmation,
          options: getYesNoOptions(),
          width: 'half',
          condition: (answers) => {
            const { incomePlan } = getApplicationAnswers(answers)
            return incomePlanHasOnlyZeroIncome(incomePlan)
          },
        }),
      ],
    }),
  ],
})
