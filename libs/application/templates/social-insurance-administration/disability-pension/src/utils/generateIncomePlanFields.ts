import { RepeaterItem } from '@island.is/application/types'
import { getApplicationExternalData } from './getApplicationAnswers'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getCategoriesOptions,
  getCurrencies,
  getTypesOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { YES } from '@island.is/application/core'
import {
  ISK,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { siaGeneralCurrenciesQuery } from '../graphql/queries'
import {
  updateEqualIncomePerMonth,
  updateIncomePerYear,
  updateIncomeTypeValue,
} from './valueUpdaters'
import { isForeignCurrency } from './isForeignCurrency'
import {
  equalIncomePerMonthCondition,
  incomePerYearCondition,
  unevenIncomePerYearCondition,
} from './conditions'
import { watchIncomePerYearValue } from './valueWatchers'
import { generateMonthInput } from './generateMonthInput'
import { Query } from '@island.is/api/schema'

export const generateIncomePlanFields = (): Record<string, RepeaterItem> => {
  return {
    incomeCategory: {
      component: 'select',
      label: sm.incomePlan.incomeCategory,
      placeholder: sm.incomePlan.selectIncomeCategory,
      displayInTable: false,
      width: 'half',
      isSearchable: true,
      options: (application) => {
        const { categorizedIncomeTypes = [] } = getApplicationExternalData(
          application.externalData,
        )
        return getCategoriesOptions(categorizedIncomeTypes)
      },
    },
    incomeType: {
      component: 'select',
      label: sm.incomePlan.incomeType,
      placeholder: sm.incomePlan.selectIncomeType,
      width: 'half',
      isSearchable: true,
      updateValueObj: {
        valueModifier: updateIncomeTypeValue,
        watchValues: 'incomeCategory',
      },
      options: (application, activeField) => {
        const { categorizedIncomeTypes = [] } = getApplicationExternalData(
          application.externalData,
        )

        return getTypesOptions(
          categorizedIncomeTypes,
          activeField?.incomeCategory,
        )
      },
    },
    currency: {
      component: 'selectAsync',
      label: sm.incomePlan.currency,
      placeholder: sm.incomePlan.selectCurrency,
      isSearchable: true,
      updateValueObj: {
        valueModifier: (_, activeField) =>
          isForeignCurrency(activeField) ? null : ISK,
        watchValues: 'incomeType',
      },
      loadOptions: async ({ apolloClient }, _, activeField) => {
        const { data } = await apolloClient.query<Query>({
          query: siaGeneralCurrenciesQuery,
        })

        return getCurrencies(
          data.socialInsuranceGeneral?.currencies ?? [],
          isForeignCurrency(activeField) ? ISK : '',
        )
      },
    },
    income: {
      component: 'radio',
      displayInTable: false,
      largeButtons: false,
      options: [
        {
          value: RatioType.YEARLY,
          label: sm.incomePlan.annualIncome,
        },
        {
          value: RatioType.MONTHLY,
          label: sm.incomePlan.monthlyIncome,
        },
      ],
    },
    equalForeignIncomePerMonth: {
      component: 'input',
      label: sm.incomePlan.equalForeignIncomePerMonth,
      width: 'half',
      type: 'number',
      displayInTable: false,
      currency: true,
      updateValueObj: {
        valueModifier: (_, activeField) =>
          updateEqualIncomePerMonth(activeField, true),
        watchValues: 'income',
      },
      suffix: '',
      condition: (_, activeField) =>
        equalIncomePerMonthCondition(activeField, true),
    },
    equalIncomePerMonth: {
      component: 'input',
      label: sm.incomePlan.equalIncomePerMonth,
      width: 'half',
      type: 'number',
      displayInTable: false,
      currency: true,
      updateValueObj: {
        valueModifier: (_, activeField) =>
          updateEqualIncomePerMonth(activeField),
        watchValues: 'income',
      },
      suffix: '',
      condition: (_, activeField) => equalIncomePerMonthCondition(activeField),
    },
    incomePerYear: {
      component: 'input',
      label: sm.incomePlan.incomePerYear,
      width: 'half',
      type: 'number',
      currency: true,
      disabled: (_, activeField) => {
        return activeField?.income === RatioType.MONTHLY
      },
      updateValueObj: {
        valueModifier: (_, activeField) => updateIncomePerYear(activeField),
        watchValues: watchIncomePerYearValue,
      },
      suffix: '',
      condition: (_, activeField) => incomePerYearCondition(activeField),
    },
    unevenIncomePerYear: {
      component: 'checkbox',
      large: true,
      width: 'full',
      options: [
        {
          value: YES,
          label: sm.incomePlan.monthlyDistributionOfIncome,
          tooltip: sm.incomePlan.monthlyDistributionOfIncomeTooltip,
        },
      ],
      displayInTable: false,
      condition: (_, activeField) => unevenIncomePerYearCondition(activeField),
    },
    january: generateMonthInput(sm.incomePlan.january),
    february: generateMonthInput(sm.incomePlan.february),
    march: generateMonthInput(sm.incomePlan.march),
    april: generateMonthInput(sm.incomePlan.april),
    may: generateMonthInput(sm.incomePlan.may),
    june: generateMonthInput(sm.incomePlan.june),
    july: generateMonthInput(sm.incomePlan.july),
    august: generateMonthInput(sm.incomePlan.august),
    september: generateMonthInput(sm.incomePlan.september),
    october: generateMonthInput(sm.incomePlan.october),
    november: generateMonthInput(sm.incomePlan.november),
    december: generateMonthInput(sm.incomePlan.december),
  }
}
