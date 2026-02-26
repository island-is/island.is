import {
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
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getCategoriesOptions,
  getCurrencies,
  getTypesOptions,
  shouldShowEqualIncomePerMonth,
  shouldShowIncomePlanMonths,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'
import {
  incomeTypeValueModifier,
  currencyValueModifier,
  equalIncomePerMonthValueModifier,
  incomePerYearValueModifier,
} from '@island.is/application/templates/social-insurance-administration-core/lib/incomePlanUtils'
import { getApplicationExternalData } from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const incomePlanSubSection = buildSubSection({
  id: 'incomePlanSubSection',
  title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
  children: [
    buildTableRepeaterField({
      id: 'incomePlanTable',
      title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
      description: (application: Application) => {
        const { incomePlanConditions } = getApplicationExternalData(
          application.externalData,
        )

        return {
          ...socialInsuranceAdministrationMessage.incomePlan.description,
          values: {
            incomePlanYear:
              incomePlanConditions?.incomePlanYear ?? new Date().getFullYear(),
          },
        }
      },
      formTitle: socialInsuranceAdministrationMessage.incomePlan.registerIncome,
      addItemButtonText:
        socialInsuranceAdministrationMessage.incomePlan.addIncome,
      saveItemButtonText:
        socialInsuranceAdministrationMessage.incomePlan.saveIncome,
      editField: true,
      editButtonTooltipText:
        socialInsuranceAdministrationMessage.incomePlan.editIncome,
      removeButtonTooltipText:
        socialInsuranceAdministrationMessage.incomePlan.removeIncome,
      fields: {
        incomeCategory: {
          component: 'select',
          label: socialInsuranceAdministrationMessage.incomePlan.incomeCategory,
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
            socialInsuranceAdministrationMessage.incomePlan.selectIncomeType,
          width: 'half',
          isSearchable: true,
          updateValueObj: {
            valueModifier: (application, activeField) =>
              incomeTypeValueModifier(application, activeField),
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
          updateValueObj: {
            valueModifier: (_, activeField) =>
              currencyValueModifier(activeField),
            watchValues: 'incomeType',
          },
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
                socialInsuranceAdministrationMessage.incomePlan.annualIncome,
            },
            {
              value: RatioType.MONTHLY,
              label:
                socialInsuranceAdministrationMessage.incomePlan.monthlyIncome,
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
            socialInsuranceAdministrationMessage.incomePlan.equalIncomePerMonth,
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
          label: socialInsuranceAdministrationMessage.incomePlan.incomePerYear,
          width: 'half',
          type: 'number',
          currency: true,
          disabled: (_, activeField) => {
            return activeField?.income === RatioType.MONTHLY
          },
          updateValueObj: {
            valueModifier: (_, activeField) =>
              incomePerYearValueModifier(activeField),
            watchValues: (activeField) => {
              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.incomeCategory === INCOME &&
                activeField?.unevenIncomePerYear?.[0] === YES
              ) {
                return [
                  'january',
                  'february',
                  'march',
                  'april',
                  'may',
                  'june',
                  'july',
                  'august',
                  'september',
                  'october',
                  'november',
                  'december',
                ]
              }
              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.currency === ISK
              ) {
                return 'equalIncomePerMonth'
              }
              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.currency !== ISK
              ) {
                return 'equalForeignIncomePerMonth'
              }
              return undefined
            },
          },
          suffix: '',
          condition: (_, activeField) => {
            return (
              activeField?.income === RatioType.YEARLY ||
              activeField?.income === RatioType.MONTHLY
            )
          },
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
          condition: (_, activeField) => {
            return (
              activeField?.income === RatioType.MONTHLY &&
              activeField?.incomeCategory === INCOME
            )
          },
        },
        january: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.january,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        february: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.february,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        march: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.march,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        april: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.april,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        may: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.may,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        june: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.june,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        july: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.july,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        august: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.august,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        september: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.september,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        october: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.october,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        november: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.november,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
        december: {
          component: 'input',
          label: socialInsuranceAdministrationMessage.months.desember,
          width: 'third',
          type: 'number',
          backgroundColor: 'blue',
          displayInTable: false,
          currency: true,
          suffix: '',
          condition: (_, activeField) =>
            shouldShowIncomePlanMonths(activeField),
        },
      },
      table: {
        format: {
          incomePerYear: (value) => value && formatCurrencyWithoutSuffix(value),
        },
        header: [
          socialInsuranceAdministrationMessage.incomePlan.incomeType,
          socialInsuranceAdministrationMessage.incomePlan.incomePerYear,
          socialInsuranceAdministrationMessage.incomePlan.currency,
        ],
        rows: ['incomeType', 'incomePerYear', 'currency'],
      },
    }),
  ],
})
