import {
  buildSubSection,
  buildTableRepeaterField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  ISK,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { IncomePlanConditions } from '@island.is/application/templates/social-insurance-administration-core/types'
import {
  getCategoriesOptions,
  getCurrencies,
  getTypesOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'
import { Application } from '@island.is/application/types'
import { SectionRouteEnum } from '../../../types/routes'
import { siaGeneralCurrenciesQuery } from '../../../graphql/queries'
import { generateMonthInput } from '../../../utils/generateMonthInput'
import { getApplicationExternalData } from '../../../utils'
import {
  updateEqualIncomePerMonth,
  updateIncomePerYear,
  updateIncomeTypeValue,
} from '../../../utils/valueUpdaters'
import { isForeignCurrency } from '../../../utils/isForeignCurrency'
import {
  equalIncomePerMonthCondition,
  incomePerYearCondition,
  unevenIncomePerYearCondition,
} from '../../../utils/conditions'
import { watchIncomePerYearValue } from '../../../utils/valueWatchers'
import { Query } from '@island.is/api/schema'

export const incomePlanSubSection = buildSubSection({
  id: SectionRouteEnum.INCOME_PLAN,
  title: sm.incomePlan.subSectionTitle,
  children: [
    buildTableRepeaterField({
      id: SectionRouteEnum.INCOME_PLAN,
      title: sm.incomePlan.subSectionTitle,
      description: (application: Application) => {
        const incomePlanConditions = getValueViaPath<IncomePlanConditions>(
          application.externalData,
          'socialInsuranceAdministrationIncomePlanConditions.data',
        )
        return {
          ...sm.incomePlan.description,
          values: {
            incomePlanYear:
              incomePlanConditions?.incomePlanYear ?? new Date().getFullYear(),
          },
        }
      },
      formTitle: sm.incomePlan.registerIncome,
      addItemButtonText: sm.incomePlan.addIncome,
      saveItemButtonText: sm.incomePlan.saveIncome,
      editField: true,
      editButtonTooltipText: sm.incomePlan.editIncome,
      removeButtonTooltipText: sm.incomePlan.removeIncome,
      fields: {
        incomeCategory: {
          component: 'select',
          label: sm.incomePlan.incomeCategory,
          placeholder: sm.incomePlan.selectIncomeCategory,
          displayInTable: false,
          width: 'half',
          isSearchable: true,
          options: ({ externalData }) => {
            const { categorizedIncomeTypes = [] } =
              getApplicationExternalData(externalData)
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
          options: ({ externalData }, activeField) => {
            const { categorizedIncomeTypes = [] } =
              getApplicationExternalData(externalData)

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
            valueModifier: (_, activeField) => {
              const defaultCurrency = isForeignCurrency(activeField)
                ? null
                : ISK

              return defaultCurrency
            },
            watchValues: 'incomeType',
          },
          loadOptions: async ({ apolloClient }, _, activeField) => {
            const { data } = await apolloClient.query<Query>({
              query: siaGeneralCurrenciesQuery,
            })

            const hideISKCurrency = isForeignCurrency(activeField) ? ISK : ''

            return getCurrencies(
              data.socialInsuranceGeneral?.currencies ?? [],
              hideISKCurrency,
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
            watchValues: ['income', 'currency', 'unevenIncomePerYear'],
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
            watchValues: ['income', 'currency', 'unevenIncomePerYear'],
          },
          suffix: '',
          condition: (_, activeField) =>
            equalIncomePerMonthCondition(activeField),
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
          condition: (_, activeField) =>
            unevenIncomePerYearCondition(activeField),
        },
        january: generateMonthInput(sm.months.january),
        february: generateMonthInput(sm.months.february),
        march: generateMonthInput(sm.months.march),
        april: generateMonthInput(sm.months.april),
        may: generateMonthInput(sm.months.may),
        june: generateMonthInput(sm.months.june),
        july: generateMonthInput(sm.months.july),
        august: generateMonthInput(sm.months.august),
        september: generateMonthInput(sm.months.september),
        october: generateMonthInput(sm.months.october),
        november: generateMonthInput(sm.months.november),
        december: generateMonthInput(sm.months.december),
      },
      table: {
        format: {
          incomePerYear: (value) => value && formatCurrencyWithoutSuffix(value),
        },
        header: [
          sm.incomePlan.incomeType,
          sm.incomePlan.incomePerYear,
          sm.incomePlan.currency,
        ],
        rows: ['incomeType', 'incomePerYear', 'currency'],
      },
    }),
  ],
})
