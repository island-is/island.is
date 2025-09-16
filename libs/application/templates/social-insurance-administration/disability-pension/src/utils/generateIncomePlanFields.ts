import { RepeaterItem } from "@island.is/application/types";
import {  getApplicationExternalData } from "./getApplicationAnswers";
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getCategoriesOptions,
  getCurrencies,
  getTypesOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { YES } from "@island.is/application/core";
import { ISK, RatioType } from "@island.is/application/templates/social-insurance-administration-core/lib/constants";
import { siaGeneralCurrenciesQuery } from "../graphql/queries";
import { SocialInsuranceGeneralCurrenciesQuery } from "../graphql/queries.generated";
import { updateEqualIncomePerMonth, updateIncomePerYear, updateIncomeTypeValue } from "./valueUpdaters";
import { isForeignCurrency } from "./isForeignCurrency";
import { equalIncomePerMonthCondition, incomePerYearCondition, monthInputCondition, unevenIncomePerYearCondition } from "./conditions";
import { watchIncomePerYearValue } from "./valueWatchers";
import { MONTH_NAMES_WITH_LABEL } from "../types";
import { MessageDescriptor } from "react-intl";


export const generateIncomePlanFields = (): Record<string, RepeaterItem> => {
  return ({
    incomeCategory: {
      component: 'select',
      label: sm.incomePlan.incomeCategory,
      placeholder:
        sm.incomePlan
          .selectIncomeCategory,
      displayInTable: false,
      width: 'half',
      isSearchable: true,
      options: (application) => {
        const { categorizedIncomeTypes = [] } = getApplicationExternalData(application.externalData)
        return getCategoriesOptions(categorizedIncomeTypes)
      },
    },
    incomeType: {
      component: 'select',
      label: sm.incomePlan.incomeType,
      placeholder:
        sm.incomePlan.selectIncomeType,
      width: 'half',
      isSearchable: true,
      updateValueObj: {
        valueModifier: updateIncomeTypeValue,
        watchValues: 'incomeCategory',
      },
      options: (application, activeField) => {
        const { categorizedIncomeTypes = [] } = getApplicationExternalData(application.externalData)

        return getTypesOptions(
          categorizedIncomeTypes,
          activeField?.incomeCategory,
        )
      },
    },
    currency: {
      component: 'selectAsync',
      label: sm.incomePlan.currency,
      placeholder:
        sm.incomePlan.selectCurrency,
      isSearchable: true,
      updateValueObj: {
        valueModifier: (_, activeField) => isForeignCurrency(activeField) ? null : ISK,
        watchValues: 'incomeType',
      },
      loadOptions: async ({ apolloClient }, _, activeField) => {
        const { data } =
          await apolloClient.query<SocialInsuranceGeneralCurrenciesQuery>({
            query: siaGeneralCurrenciesQuery,
          })

        return getCurrencies(
          data.socialInsuranceGeneral?.currencies ?? [],
          isForeignCurrency(activeField)
            ? ISK
            : ''
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
          label:
            sm.incomePlan.annualIncome,
        },
        {
          value: RatioType.MONTHLY,
          label:
            sm.incomePlan.monthlyIncome,
        },
      ],
    },
    equalForeignIncomePerMonth: {
      component: 'input',
      label:
        sm.incomePlan
          .equalForeignIncomePerMonth,
      width: 'half',
      type: 'number',
      displayInTable: false,
      currency: true,
      updateValueObj: {
        valueModifier: (_, activeField) => updateEqualIncomePerMonth(activeField, true),
        watchValues: 'income',
      },
      suffix: '',
      condition: (_, activeField) => equalIncomePerMonthCondition(activeField, true)
    },
    equalIncomePerMonth: {
      component: 'input',
      label:
        sm.incomePlan.equalIncomePerMonth,
      width: 'half',
      type: 'number',
      displayInTable: false,
      currency: true,
      updateValueObj: {
        valueModifier: (_, activeField) => updateEqualIncomePerMonth(activeField),
        watchValues: 'income',
      },
      suffix: '',
      condition: (_, activeField) => equalIncomePerMonthCondition(activeField)
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
      condition: (_, activeField) => incomePerYearCondition(activeField)

    },
    unevenIncomePerYear: {
      component: 'checkbox',
      large: true,
      width: 'full',
      options: [
        {
          value: YES,
          label:
            sm.incomePlan
              .monthlyDistributionOfIncome,
          tooltip:
            sm.incomePlan
              .monthlyDistributionOfIncomeTooltip,
        },
      ],
      displayInTable: false,
      condition: (_, activeField) => unevenIncomePerYearCondition(activeField)
    },
    ...MONTH_NAMES_WITH_LABEL.map(month => generateMonthInput(month.value, month.label )),
  })
};
