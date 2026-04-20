import {
  YES,
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import {
  DIVIDENDS_IN_FOREIGN_BANKS,
  FOREIGN_BASIC_PENSION,
  FOREIGN_INCOME,
  FOREIGN_PENSION,
  INCOME,
  INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
  ISK,
  MONTHS,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getCurrencies,
  getCategoriesOptions,
  getTypesOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import isEmpty from 'lodash/isEmpty'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../lib/incomePlanUtils'
import { incomePlanFormMessage } from '../lib/messages'

export const IncomePlanForm: Form = buildForm({
  id: 'IncomePlanDraft',
  title: incomePlanFormMessage.pre.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'incomePlan',
      title: socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
      children: [
        buildSubSection({
          id: 'incomePlanInstructions',
          title: incomePlanFormMessage.info.instructionsShortTitle,
          children: [
            buildDescriptionField({
              id: 'instructions',
              title:
                socialInsuranceAdministrationMessage.incomePlanInstructions
                  .title,
              description:
                socialInsuranceAdministrationMessage.incomePlanInstructions
                  .instructions,
              space: 'containerGutter',
              doesNotRequireAnswer: false,
            }),
          ],
        }),
        buildSubSection({
          id: 'incomePlan',
          title:
            socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
          children: [
            buildTableRepeaterField({
              id: 'incomePlanTable',
              title:
                socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
              description: (application: Application) => {
                const { incomePlanConditions, latestIncomePlan } =
                  getApplicationExternalData(application.externalData)
                const hasLatestIncomePlan = !isEmpty(latestIncomePlan)
                const baseMessage = hasLatestIncomePlan
                  ? incomePlanFormMessage.incomePlan
                      .currentIncomePlanDescription
                  : socialInsuranceAdministrationMessage.incomePlan.description

                return {
                  ...baseMessage,
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
              fields: {
                incomeCategory: {
                  component: 'select',
                  label:
                    socialInsuranceAdministrationMessage.incomePlan
                      .incomeCategory,
                  placeholder:
                    socialInsuranceAdministrationMessage.incomePlan
                      .selectIncomeCategory,
                  displayInTable: false,
                  width: 'half',
                  isSearchable: true,
                  options: (application) => {
                    const { categorizedIncomeTypes } =
                      getApplicationExternalData(application.externalData)

                    return getCategoriesOptions(categorizedIncomeTypes)
                  },
                },
                incomeType: {
                  component: 'select',
                  label:
                    socialInsuranceAdministrationMessage.incomePlan.incomeType,
                  placeholder:
                    socialInsuranceAdministrationMessage.incomePlan
                      .selectIncomeType,
                  width: 'half',
                  isSearchable: true,
                  updateValueObj: {
                    valueModifier: (application, activeField) => {
                      const { categorizedIncomeTypes } =
                        getApplicationExternalData(application.externalData)

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
                    const { categorizedIncomeTypes } =
                      getApplicationExternalData(application.externalData)

                    return getTypesOptions(
                      categorizedIncomeTypes,
                      activeField?.incomeCategory,
                    )
                  },
                },
                currency: {
                  component: 'select',
                  label:
                    socialInsuranceAdministrationMessage.incomePlan.currency,
                  placeholder:
                    socialInsuranceAdministrationMessage.incomePlan
                      .selectCurrency,
                  isSearchable: true,
                  updateValueObj: {
                    valueModifier: (_, activeField) => {
                      const defaultCurrency =
                        activeField?.incomeType === FOREIGN_BASIC_PENSION ||
                        activeField?.incomeType === FOREIGN_PENSION ||
                        activeField?.incomeType === FOREIGN_INCOME ||
                        activeField?.incomeType ===
                          INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS ||
                        activeField?.incomeType === DIVIDENDS_IN_FOREIGN_BANKS
                          ? null
                          : ISK

                      return defaultCurrency
                    },
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
                    valueModifier: (_, activeField) => {
                      const unevenAndEmploymentIncome =
                        activeField?.unevenIncomePerYear?.[0] !== YES ||
                        (activeField?.incomeCategory !== INCOME &&
                          activeField?.unevenIncomePerYear?.[0] === YES)

                      if (
                        activeField?.income === RatioType.MONTHLY &&
                        activeField?.currency !== ISK &&
                        unevenAndEmploymentIncome
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
                    const unevenAndEmploymentIncome =
                      activeField?.unevenIncomePerYear?.[0] !== YES ||
                      (activeField?.incomeCategory !== INCOME &&
                        activeField?.unevenIncomePerYear?.[0] === YES)

                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.currency !== ISK &&
                      unevenAndEmploymentIncome
                    )
                  },
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
                    valueModifier: (_, activeField) => {
                      const unevenAndEmploymentIncome =
                        activeField?.unevenIncomePerYear?.[0] !== YES ||
                        (activeField?.incomeCategory !== INCOME &&
                          activeField?.unevenIncomePerYear?.[0] === YES)

                      if (
                        activeField?.income === RatioType.MONTHLY &&
                        activeField?.currency === ISK &&
                        unevenAndEmploymentIncome
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
                    const unevenAndEmploymentIncome =
                      activeField?.unevenIncomePerYear?.[0] !== YES ||
                      (activeField?.incomeCategory !== INCOME &&
                        activeField?.unevenIncomePerYear?.[0] === YES)

                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.currency === ISK &&
                      unevenAndEmploymentIncome
                    )
                  },
                },
                incomePerYear: {
                  component: 'input',
                  label:
                    socialInsuranceAdministrationMessage.incomePlan
                      .incomePerYear,
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
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
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategory === INCOME &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
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
          ],
        }),
      ],
    }),
    buildSection({
      id: 'temporaryCalculationSection',
      title: incomePlanFormMessage.info.temporaryCalculationTitle,
      condition: (_, externalData) => {
        const { latestIncomePlan } = getApplicationExternalData(externalData)
        return !isEmpty(latestIncomePlan)
      },
      children: [
        buildMultiField({
          id: 'temporaryCalculation',
          title: incomePlanFormMessage.info.temporaryCalculationTitle,
          description: incomePlanFormMessage.info.tableDescription,
          children: [
            buildCustomField({
              id: 'overviewPrint',
              doesNotRequireAnswer: true,
              component: 'PrintScreen',
            }),
            buildSelectField({
              id: 'temporaryCalculation.month',
              title: socialInsuranceAdministrationMessage.period.month,
              width: 'half',
              options: MONTHS,
              defaultValue: MONTHS[new Date().getMonth()].value,
              condition: (answers) =>
                getApplicationAnswers(answers).temporaryCalculationShow,
            }),
            buildCustomField({
              id: 'temporaryCalculationTable',
              component: 'TemporaryCalculationTable',
            }),
            buildDescriptionField({
              id: 'assumptions',
              description: incomePlanFormMessage.info.assumptions,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
      children: [
        buildMultiField({
          id: 'confirm',
          description: '',
          children: [
            buildCustomField(
              {
                id: 'confirmScreen',
                title: '',
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: socialInsuranceAdministrationMessage.confirm.submitButton,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: incomePlanFormMessage.confirm.title,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      multiFieldTitle: incomePlanFormMessage.conclusionScreen.receivedTitle,
      alertTitle: incomePlanFormMessage.conclusionScreen.alertTitle,
      alertMessage: '',
      expandableDescription: incomePlanFormMessage.conclusionScreen.bulletList,
      expandableIntro: '',
      bottomButtonMessage:
        incomePlanFormMessage.conclusionScreen.bottomButtonMessage,
      bottomButtonLink: '/minarsidur/umsoknir',
    }),
  ],
})
