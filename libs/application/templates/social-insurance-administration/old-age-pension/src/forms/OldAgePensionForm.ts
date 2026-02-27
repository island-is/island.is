import {
  buildAlertMessageField,
  buildBankAccountField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTableRepeaterField,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import {
  BankAccountType,
  DIVIDENDS_IN_FOREIGN_BANKS,
  fileUploadSharedProps,
  FOREIGN_BASIC_PENSION,
  FOREIGN_INCOME,
  FOREIGN_PENSION,
  INCOME,
  INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
  IS,
  ISK,
  MONTH_NAMES,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getCategoriesOptions,
  getCurrencies,
  getTaxOptions,
  getTypesOptions,
  getYesNoOptions,
  shouldShowEqualIncomePerMonth,
  typeOfBankInfo,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  incomeTypeValueModifier,
  currencyValueModifier,
  equalIncomePerMonthValueModifier,
  incomePerYearValueModifier,
} from '@island.is/application/templates/social-insurance-administration-core/lib/incomePlanUtils'
import { generateMonthInput } from '@island.is/application/templates/social-insurance-administration-core/lib/generateMonthInput'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import isEmpty from 'lodash/isEmpty'
import { ApplicationType, Employment, RatioType } from '../lib/constants'
import { oldAgePensionFormMessage } from '../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getAvailableMonths,
  getAvailableYears,
  isEarlyRetirement,
} from '../lib/oldAgePensionUtils'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'

export const OldAgePensionForm: Form = buildForm({
  id: 'OldAgePensionDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicant',
      title: socialInsuranceAdministrationMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
          children: [
            applicantInformationMultiField({
              emailRequired: false,
              emailDisabled: true,
              applicantInformationDescription:
                socialInsuranceAdministrationMessage.info
                  .infoSubSectionDescription,
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: socialInsuranceAdministrationMessage.payment.title,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: socialInsuranceAdministrationMessage.payment.title,
              description: '',
              children: [
                buildAlertMessageField({
                  id: 'paymentInfo.alertMessage',
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
                  message: (application: Application) => {
                    const { paymentInfo } = getApplicationAnswers(
                      application.answers,
                    )
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )

                    const type =
                      paymentInfo?.bankAccountType ??
                      typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)

                    return type === BankAccountType.ICELANDIC
                      ? socialInsuranceAdministrationMessage.payment
                          .alertMessage
                      : socialInsuranceAdministrationMessage.payment
                          .alertMessageForeign
                  },
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                }),
                buildRadioField({
                  id: 'paymentInfo.bankAccountType',
                  defaultValue: (application: Application) => {
                    const { paymentInfo } = getApplicationAnswers(
                      application.answers,
                    )
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )

                    return typeOfBankInfo(
                      bankInfo,
                      paymentInfo?.bankAccountType,
                    )
                  },
                  options: [
                    {
                      label:
                        socialInsuranceAdministrationMessage.payment
                          .icelandicBankAccount,
                      value: BankAccountType.ICELANDIC,
                    },
                    {
                      label:
                        socialInsuranceAdministrationMessage.payment
                          .foreignBankAccount,
                      value: BankAccountType.FOREIGN,
                    },
                  ],
                  largeButtons: false,
                  required: true,
                }),
                buildBankAccountField({
                  id: 'paymentInfo.bank',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return { ...bankInfo, bankNumber: bankInfo?.bank }
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { paymentInfo } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      paymentInfo?.bankAccountType ??
                      typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
                    return radio === BankAccountType.ICELANDIC
                  },
                  marginTop: 2,
                }),
                buildTextField({
                  id: 'paymentInfo.iban',
                  title: socialInsuranceAdministrationMessage.payment.iban,
                  placeholder: 'AB00 XXXX XXXX XXXX XXXX XX',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return friendlyFormatIBAN(bankInfo.iban)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { paymentInfo } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      paymentInfo?.bankAccountType ??
                      typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.swift',
                  title: socialInsuranceAdministrationMessage.payment.swift,
                  placeholder: 'AAAA BB CC XXX',
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return friendlyFormatSWIFT(bankInfo.swift)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { paymentInfo } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      paymentInfo?.bankAccountType ??
                      typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildSelectField({
                  id: 'paymentInfo.currency',
                  title: socialInsuranceAdministrationMessage.payment.currency,
                  width: 'half',
                  placeholder:
                    socialInsuranceAdministrationMessage.payment.selectCurrency,
                  options: ({ externalData }: Application) => {
                    const { currencies } =
                      getApplicationExternalData(externalData)
                    return getCurrencies(currencies)
                  },
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.currency : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { paymentInfo } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      paymentInfo?.bankAccountType ??
                      typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.bankName',
                  title: socialInsuranceAdministrationMessage.payment.bankName,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.foreignBankName : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { paymentInfo } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      paymentInfo?.bankAccountType ??
                      typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.bankAddress',
                  title:
                    socialInsuranceAdministrationMessage.payment.bankAddress,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.foreignBankAddress : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { paymentInfo } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      paymentInfo?.bankAccountType ??
                      typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildRadioField({
                  id: 'paymentInfo.personalAllowance',
                  title:
                    socialInsuranceAdministrationMessage.payment
                      .personalAllowance,
                  options: getYesNoOptions(),
                  width: 'half',
                  largeButtons: true,
                  required: true,
                  space: 'containerGutter',
                }),
                buildTextField({
                  id: 'paymentInfo.personalAllowanceUsage',
                  title:
                    socialInsuranceAdministrationMessage.payment
                      .personalAllowancePercentage,
                  suffix: '%',
                  dataTestId: 'personal-allowance-usage',
                  condition: (answers) => {
                    const { personalAllowance } = getApplicationAnswers(answers)
                    return personalAllowance === YES
                  },
                  placeholder: '1%',
                  defaultValue: '100',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
                buildAlertMessageField({
                  id: 'payment.spouseAllowance.alert',
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
                  message:
                    socialInsuranceAdministrationMessage.payment
                      .alertSpouseAllowance,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  condition: (_, externalData) => {
                    const { hasSpouse } =
                      getApplicationExternalData(externalData)
                    if (hasSpouse) return true
                    return false
                  },
                }),
                buildRadioField({
                  id: 'paymentInfo.taxLevel',
                  title: socialInsuranceAdministrationMessage.payment.taxLevel,
                  options: getTaxOptions(),
                  width: 'full',
                  largeButtons: true,
                  space: 'containerGutter',
                  defaultValue: TaxLevelOptions.INCOME,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'incomePlanInstructionsSubSection',
          title:
            socialInsuranceAdministrationMessage.incomePlan
              .incomePlanInstructionsSubSectionTitle,
          children: [
            buildMultiField({
              id: 'incomePlanInstructions',
              title:
                socialInsuranceAdministrationMessage.incomePlan.subSectionTitle,
              description:
                socialInsuranceAdministrationMessage.incomePlanInstructions
                  .title,
              children: [
                buildDescriptionField({
                  id: 'instructions',
                  description:
                    socialInsuranceAdministrationMessage.incomePlanInstructions
                      .instructions,
                  space: 0,
                }),
              ],
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
                const { incomePlanConditions } = getApplicationExternalData(
                  application.externalData,
                )

                return {
                  ...socialInsuranceAdministrationMessage.incomePlan
                    .description,
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
                      return incomeTypeValueModifier(
                        categorizedIncomeTypes,
                        activeField,
                      )
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
                    socialInsuranceAdministrationMessage.incomePlan
                      .incomePerYear,
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
                        return MONTH_NAMES
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
          ],
        }),
        buildSubSection({
          id: 'onePaymentPerYear',
          title:
            oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
          children: [
            buildMultiField({
              id: 'onePaymentPerYear',
              title:
                oldAgePensionFormMessage.onePaymentPerYear
                  .onePaymentPerYearTitle,
              description:
                oldAgePensionFormMessage.onePaymentPerYear
                  .onePaymentPerYearDescription,
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
        }),
        buildSubSection({
          id: 'residence',
          title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
          children: [
            buildMultiField({
              id: 'residenceHistory',
              title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
              description:
                oldAgePensionFormMessage.residence.residenceHistoryDescription,
              children: [
                buildCustomField({
                  id: 'residenceHistory.table',
                  doesNotRequireAnswer: true,
                  component: 'ResidenceHistory',
                  condition: (_, externalData) => {
                    const { residenceHistory } =
                      getApplicationExternalData(externalData)
                    // if no residence history returned, dont show the table
                    if (residenceHistory.length === 0) return false
                    return true
                  },
                }),
                buildRadioField({
                  id: 'residenceHistory.question',
                  title:
                    oldAgePensionFormMessage.residence.residenceHistoryQuestion,
                  options: getYesNoOptions(),
                  width: 'half',
                  largeButtons: true,
                  condition: (_, externalData) => {
                    const { residenceHistory } =
                      getApplicationExternalData(externalData)
                    // if no residence history returned or if residence history is only iceland, show the question
                    if (residenceHistory.length === 0) return true
                    return residenceHistory.every(
                      (residence) => residence.country === IS,
                    )
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'employment',
      title: oldAgePensionFormMessage.employer.employerTitle,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)
        return applicationType === ApplicationType.HALF_OLD_AGE_PENSION
      },
      children: [
        buildSubSection({
          id: 'employment.status.section',
          title: oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
          children: [
            buildRadioField({
              id: 'employment.status',
              title:
                oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
              description:
                oldAgePensionFormMessage.employer
                  .selfEmployedOrEmployeeDescription,
              options: [
                {
                  value: Employment.SELFEMPLOYED,
                  label: oldAgePensionFormMessage.employer.selfEmployed,
                },
                {
                  value: Employment.EMPLOYEE,
                  label: oldAgePensionFormMessage.employer.employee,
                },
              ],
              width: 'half',
              defaultValue: Employment.EMPLOYEE,
              largeButtons: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'employment.selfEmployedAttachment.section',
          title: oldAgePensionFormMessage.fileUpload.selfEmployedTitle,
          condition: (answers) => {
            const { employmentStatus } = getApplicationAnswers(answers)

            return employmentStatus === Employment.SELFEMPLOYED
          },
          children: [
            buildFileUploadField({
              id: 'employment.selfEmployedAttachment',
              title: oldAgePensionFormMessage.fileUpload.selfEmployedTitle,
              description:
                oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
              ...fileUploadSharedProps,
              condition: (answers) => {
                const { employmentStatus } = getApplicationAnswers(answers)

                return employmentStatus === Employment.SELFEMPLOYED
              },
            }),
          ],
        }),
        buildSubSection({
          id: 'employerRegistration',
          title: oldAgePensionFormMessage.employer.registrationTitle,
          condition: (answers) => {
            const { employmentStatus } = getApplicationAnswers(answers)

            return employmentStatus === Employment.EMPLOYEE
          },
          children: [
            buildRepeater({
              id: 'employers',
              title: oldAgePensionFormMessage.employer.employerTitle,
              component: 'EmployersOverview',
              children: [
                buildMultiField({
                  id: 'addEmployers',
                  title: oldAgePensionFormMessage.employer.registrationTitle,
                  isPartOfRepeater: true,
                  children: [
                    buildTextField({
                      id: 'email',
                      variant: 'email',
                      title: oldAgePensionFormMessage.employer.email,
                    }),
                    buildTextField({
                      id: 'phoneNumber',
                      variant: 'tel',
                      format: '###-####',
                      placeholder: '000-0000',
                      title: oldAgePensionFormMessage.employer.phoneNumber,
                    }),
                    buildRadioField({
                      id: 'ratioType',
                      width: 'half',
                      space: 3,
                      options: [
                        {
                          value: RatioType.YEARLY,
                          label: oldAgePensionFormMessage.employer.ratioYearly,
                        },
                        {
                          value: RatioType.MONTHLY,
                          label: oldAgePensionFormMessage.employer.ratioMonthly,
                        },
                      ],
                    }),
                    buildTextField({
                      id: 'ratioYearly',
                      description: '',
                      title: oldAgePensionFormMessage.employer.ratio,
                      suffix: '%',
                      condition: (answers) => {
                        const { rawEmployers } = getApplicationAnswers(answers)
                        const currentEmployer =
                          rawEmployers[rawEmployers.length - 1]

                        return currentEmployer?.ratioType === RatioType.YEARLY
                      },
                      placeholder: '1-50%',
                      variant: 'number',
                      width: 'full',
                    }),
                    buildCustomField({
                      id: 'ratioMonthly',
                      component: 'EmployersRatioMonthly',
                      condition: (answers) => {
                        const { rawEmployers } = getApplicationAnswers(answers)
                        const currentEmployer =
                          rawEmployers[rawEmployers.length - 1]

                        return currentEmployer?.ratioType === RatioType.MONTHLY
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
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
              options: (application: Application) => {
                return getAvailableYears(application)
              },
            }),
            buildSelectField({
              id: 'period.month',
              title: socialInsuranceAdministrationMessage.period.month,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.period.monthDefaultText,
              options: (application: Application) => {
                const { selectedYear } = getApplicationAnswers(
                  application.answers,
                )

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
              condition: (answers, externalData) => {
                return isEarlyRetirement(answers, externalData)
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'fileUpload',
      title: socialInsuranceAdministrationMessage.fileUpload.title,
      children: [
        buildSubSection({
          condition: (answers) => {
            const { applicationType } = getApplicationAnswers(answers)
            return applicationType === ApplicationType.SAILOR_PENSION
          },
          id: 'fileUpload.fishermen.section',
          title: oldAgePensionFormMessage.fileUpload.fishermenFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUpload.fishermen',
              title: oldAgePensionFormMessage.fileUpload.fishermenFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
              ...fileUploadSharedProps,
              condition: (answers) => {
                const { applicationType } = getApplicationAnswers(answers)

                return applicationType === ApplicationType.SAILOR_PENSION
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title: socialInsuranceAdministrationMessage.additionalInfo.section,
      children: [
        buildSubSection({
          id: 'commentSection',
          title:
            socialInsuranceAdministrationMessage.additionalInfo.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentSection,
              variant: 'textarea',
              rows: 10,
              description:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentDescription,
              placeholder:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentPlaceholder,
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
                  event: DefaultEvents.ABORT,
                  name: socialInsuranceAdministrationMessage.confirm
                    .cancelButton,
                  type: 'reject',
                  condition: (answers) => {
                    const { tempAnswers } = getApplicationAnswers(answers)
                    return !!tempAnswers
                  },
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: socialInsuranceAdministrationMessage.confirm
                    .submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      multiFieldTitle:
        socialInsuranceAdministrationMessage.conclusionScreen.receivedTitle,
      alertTitle:
        socialInsuranceAdministrationMessage.conclusionScreen.alertTitle,
      alertMessage: oldAgePensionFormMessage.conclusionScreen.alertMessage,
      expandableIntro:
        oldAgePensionFormMessage.conclusionScreen.expandableIntro,
      expandableDescription:
        oldAgePensionFormMessage.conclusionScreen.expandableDescription,
    }),
  ],
})
