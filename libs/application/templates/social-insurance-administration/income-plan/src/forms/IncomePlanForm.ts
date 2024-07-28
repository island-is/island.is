import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubSection,
  buildSubmitField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { incomePlanFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getCurrencies } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  FOREIGN_BASIC_PENSION,
  INCOME,
  ISK,
  RatioType,
  YES,
} from '../lib/constants'
import {
  getApplicationExternalData,
  getCategoriesOptions,
  getTypesOptions,
} from '../lib/incomePlanUtils'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'

export const IncomePlanForm: Form = buildForm({
  id: 'IncomePlanDraft',
  title: incomePlanFormMessage.pre.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'incomePlan',
      title: incomePlanFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'incomePlanInstructions',
          title: incomePlanFormMessage.info.instructionsShortTitle,
          children: [
            buildMultiField({
              id: 'instructionsSection',
              title: incomePlanFormMessage.info.instructionsTitle,
              children: [
                buildDescriptionField({
                  id: 'instructions',
                  title: '',
                  description:
                    incomePlanFormMessage.info.instructionsDescription,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'incomePlan',
          title: incomePlanFormMessage.info.section,
          children: [
            buildTableRepeaterField({
              id: 'incomePlanTable',
              title: incomePlanFormMessage.info.section,
              description: incomePlanFormMessage.incomePlan.description,
              formTitle: incomePlanFormMessage.incomePlan.registerIncome,
              addItemButtonText: incomePlanFormMessage.incomePlan.addIncome,
              saveItemButtonText: incomePlanFormMessage.incomePlan.saveIncome,
              editField: true,
              editButtonTooltipText:
                incomePlanFormMessage.incomePlan.editIncome,
              removeButtonTooltipText:
                incomePlanFormMessage.incomePlan.removeIncome,
              fields: {
                incomeCategories: {
                  component: 'select',
                  label: incomePlanFormMessage.incomePlan.incomeCategory,
                  placeholder:
                    incomePlanFormMessage.incomePlan.selectIncomeCategory,
                  displayInTable: false,
                  width: 'half',
                  isSearchable: true,
                  options: (application) => {
                    return getCategoriesOptions(application.externalData)
                  },
                },
                incomeTypes: {
                  component: 'select',
                  label: incomePlanFormMessage.incomePlan.incomeType,
                  placeholder:
                    incomePlanFormMessage.incomePlan.selectIncomeType,
                  width: 'half',
                  isSearchable: true,
                  options: (application, activeField) => {
                    return getTypesOptions(
                      application.externalData,
                      activeField?.incomeCategories,
                    )
                  },
                },
                currency: {
                  component: 'select',
                  label: incomePlanFormMessage.incomePlan.currency,
                  placeholder: incomePlanFormMessage.incomePlan.selectCurrency,
                  isSearchable: true,
                  options: (application, activeField) => {
                    const { currencies } = getApplicationExternalData(
                      application.externalData,
                    )

                    const hideISKCurrency =
                      activeField?.incomeTypes === FOREIGN_BASIC_PENSION
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
                      label: incomePlanFormMessage.incomePlan.annualIncome,
                    },
                    {
                      value: RatioType.MONTHLY,
                      label: incomePlanFormMessage.incomePlan.monthlyIncome,
                    },
                  ],
                },
                equalForeignIncomePerMonth: {
                  component: 'input',
                  label:
                    incomePlanFormMessage.incomePlan.equalForeignIncomePerMonth,
                  width: 'half',
                  type: 'number',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.currency !== ISK
                    )
                  },
                },
                equalIncomePerMonth: {
                  component: 'input',
                  label: incomePlanFormMessage.incomePlan.equalIncomePerMonth,
                  width: 'half',
                  type: 'number',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.currency === ISK
                    )
                  },
                },
                incomePerYear: {
                  component: 'input',
                  label: incomePlanFormMessage.incomePlan.incomePerYear,
                  width: 'half',
                  type: 'number',
                  currency: true,
                  readonly: (_, activeField) => {
                    return activeField?.income === RatioType.MONTHLY
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
                        incomePlanFormMessage.incomePlan
                          .monthlyDistributionOfIncome,
                      tooltip:
                        incomePlanFormMessage.incomePlan
                          .monthlyDistributionOfIncomeTooltip,
                    },
                  ],
                  backgroundColor: 'blue',
                  displayInTable: false,
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.incomeCategories === INCOME
                    )
                  },
                },
                january: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.january,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                february: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.february,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                march: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.march,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                april: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.april,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                may: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.may,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                june: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.june,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                july: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.july,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                august: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.august,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                september: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.september,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                october: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.october,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                november: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.november,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
                      activeField?.unevenIncomePerYear?.[0] === YES
                    )
                  },
                },
                december: {
                  component: 'input',
                  label: socialInsuranceAdministrationMessage.months.desember,
                  width: 'third',
                  type: 'number',
                  backgroundColor: 'white',
                  displayInTable: false,
                  currency: true,
                  suffix: '',
                  condition: (_, activeField) => {
                    return (
                      activeField?.income === RatioType.MONTHLY &&
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
                  incomePlanFormMessage.incomePlan.incomeType,
                  incomePlanFormMessage.incomePlan.incomePerYear,
                  incomePlanFormMessage.incomePlan.currency,
                ],
                rows: ['incomeTypes', 'incomePerYear', 'currency'],
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'preliminaryCalculationSection',
      title: incomePlanFormMessage.info.temporaryCalculationTitle,
      children: [
        buildMultiField({
          id: 'preliminaryCalculationTable',
          title: incomePlanFormMessage.info.temporaryCalculationTitle,
          description: incomePlanFormMessage.info.tableDescription,
          children: [
            buildCustomField({
              title: '',
              id: 'printScreen',
              component: 'PrintScreen',
            }),
            buildStaticTableField({
              title: '',
              description: '',
              header: [
                incomePlanFormMessage.info.tableHeaderOne,
                incomePlanFormMessage.info.tableHeaderTwo,
                incomePlanFormMessage.info.tableHeaderThree,
              ],
              rows: [],
            }),
            buildStaticTableField({
              title: '',
              description: '',
              header: [
                incomePlanFormMessage.info.taxedTableHeader,
                '0 kr.',
                '0 kr.',
              ],
              rows: [] 
            }),
            buildDescriptionField({
              id: 'assumptions',
              title: '',
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
          title: '',
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
    }),
  ],
})
