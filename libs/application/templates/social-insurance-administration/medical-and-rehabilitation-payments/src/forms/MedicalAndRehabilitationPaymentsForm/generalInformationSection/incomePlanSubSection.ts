import {
  buildSubSection,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import {
  INCOME,
  ISK,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getCategoriesOptions,
  getCurrencies,
  getTypesOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  getMonths,
  isMonthlyIncomeAndCategoryIncome,
  isUnevenAndEmploymentIncome,
  shouldShowMonthlyUnevenIncomeField,
  showCurrency,
} from '@island.is/application/templates/social-insurance-administration-core/utils/incomePlanUtils'
import { Application } from '@island.is/application/types'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'
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
            valueModifier: (application, activeField) => {
              const { categorizedIncomeTypes } = getApplicationExternalData(
                application.externalData,
              )
              const options = getTypesOptions(
                categorizedIncomeTypes,
                activeField?.incomeCategory,
              )
              const selectedOption = options.find(
                (option) => option.value === activeField?.incomeType,
              )?.value
              return selectedOption ?? null
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
          updateValueObj: {
            valueModifier: (_, activeField) => {
              return showCurrency(activeField) ? null : ISK
            },
            watchValues: 'incomeType',
          },
          options: (application, activeField) => {
            const { currencies } = getApplicationExternalData(
              application.externalData,
            )

            const hideISKCurrency = showCurrency(activeField) ? ISK : ''
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
            valueModifier: (_, activeField) => {
              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.currency !== ISK &&
                isUnevenAndEmploymentIncome(activeField)
              ) {
                return Math.round(
                  Number(activeField?.incomePerYear) / 12,
                ).toString()
              }
              return undefined
            },
            watchValues: 'income',
          },
          suffix: '',
          condition: (_, activeField) => {
            return (
              activeField?.income === RatioType.MONTHLY &&
              activeField?.currency !== ISK &&
              isUnevenAndEmploymentIncome(activeField)
            )
          },
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
            valueModifier: (_, activeField) => {
              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.currency === ISK &&
                isUnevenAndEmploymentIncome(activeField)
              ) {
                return Math.round(
                  Number(activeField?.incomePerYear) / 12,
                ).toString()
              }
              return undefined
            },
            watchValues: 'income',
          },
          suffix: '',
          condition: (_, activeField) => {
            return (
              activeField?.income === RatioType.MONTHLY &&
              activeField?.currency === ISK &&
              isUnevenAndEmploymentIncome(activeField)
            )
          },
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
            valueModifier: (_, activeField) => {
              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.incomeCategory === INCOME &&
                activeField?.unevenIncomePerYear?.[0] === YES
              ) {
                return (
                  Number(activeField?.january ?? 0) +
                  Number(activeField?.february ?? 0) +
                  Number(activeField?.march ?? 0) +
                  Number(activeField?.april ?? 0) +
                  Number(activeField?.may ?? 0) +
                  Number(activeField?.june ?? 0) +
                  Number(activeField?.july ?? 0) +
                  Number(activeField?.august ?? 0) +
                  Number(activeField?.september ?? 0) +
                  Number(activeField?.october ?? 0) +
                  Number(activeField?.november ?? 0) +
                  Number(activeField?.december ?? 0)
                ).toString()
              }

              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.currency === ISK
              ) {
                return (
                  Number(activeField?.equalIncomePerMonth) * 12
                ).toString()
              }

              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.currency !== ISK
              ) {
                return (
                  Number(activeField?.equalForeignIncomePerMonth) * 12
                ).toString()
              }

              return undefined
            },
            watchValues: (activeField) => {
              if (
                activeField?.income === RatioType.MONTHLY &&
                activeField?.incomeCategory === INCOME &&
                activeField?.unevenIncomePerYear?.[0] === YES
              ) {
                return [...getMonths()]
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
          condition: (
            _application: unknown,
            activeField: Record<string, unknown> = {},
          ) => isMonthlyIncomeAndCategoryIncome(activeField),
        },
        // Dynamically generate month fields
        ...getMonths().reduce<{ [key: string]: unknown }>((fields, month) => {
          fields[month] = {
            component: 'input',
            label:
              socialInsuranceAdministrationMessage.months[
                month as keyof typeof socialInsuranceAdministrationMessage.months
              ],
            width: 'third',
            type: 'number',
            backgroundColor: 'blue',
            displayInTable: false,
            currency: true,
            suffix: '',
            condition: (
              _application: unknown,
              activeField: Record<string, unknown> = {},
            ) => shouldShowMonthlyUnevenIncomeField(activeField),
          }
          return fields
        }, {}),
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
