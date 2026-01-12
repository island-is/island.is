import {
  buildAlertMessageField,
  buildCustomField,
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
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import {
  BankAccountType,
  fileUploadSharedProps,
  IS,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getBankIsk,
  getCurrencies,
  getTaxOptions,
  getYesNoOptions,
  typeOfBankInfo,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
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
                    const { bankAccountType } = getApplicationAnswers(
                      application.answers,
                    )
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )

                    const type =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)

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
                    const { bankAccountType } = getApplicationAnswers(
                      application.answers,
                    )
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )

                    return typeOfBankInfo(bankInfo, bankAccountType)
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
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: socialInsuranceAdministrationMessage.payment.bank,
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return getBankIsk(bankInfo)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
                    return radio === BankAccountType.ICELANDIC
                  },
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
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
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
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
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
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
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
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
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
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
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
          id: 'fileUpload.pension.section',
          title: oldAgePensionFormMessage.fileUpload.pensionFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUpload.pension',
              title: oldAgePensionFormMessage.fileUpload.pensionFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.pensionFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.pensionFileDescription,
              ...fileUploadSharedProps,
            }),
          ],
        }),
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
    buildSection({
      id: 'conclusionSection',
      title: socialInsuranceAdministrationMessage.conclusionScreen.section,
      children: [
        buildMultiField({
          id: 'conclusion.multifield',
          title: (application: Application) => {
            const { hasIncomePlanStatus } = getApplicationExternalData(
              application.externalData,
            )
            return hasIncomePlanStatus
              ? socialInsuranceAdministrationMessage.conclusionScreen
                  .receivedTitle
              : socialInsuranceAdministrationMessage.conclusionScreen
                  .receivedAwaitingIncomePlanTitle
          },
          children: [
            buildCustomField({
              component: 'Conclusion',
              id: 'conclusion',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
