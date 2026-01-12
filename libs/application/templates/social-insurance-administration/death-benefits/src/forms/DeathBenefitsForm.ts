import {
  YES,
  buildAlertMessageField,
  buildCustomField,
  buildDateField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildStaticTableField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  FormValue,
  DefaultEvents,
} from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import { deathBenefitsFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  BankAccountType,
  TaxLevelOptions,
  fileUploadSharedProps,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import isEmpty from 'lodash/isEmpty'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getChildren,
} from '../lib/deathBenefitsUtils'
import { format as formatKennitala } from 'kennitala'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getBankIsk,
  typeOfBankInfo,
  getCurrencies,
  getTaxOptions,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'

export const DeathBenefitsForm: Form = buildForm({
  id: 'DeathBenefitsDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'infoSection',
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
                buildRadioField({
                  id: 'paymentInfo.spouseAllowance',
                  title: deathBenefitsFormMessage.payment.spouseAllowance,
                  description:
                    deathBenefitsFormMessage.payment.spouseAllowanceDescription,
                  options: getYesNoOptions(),
                  width: 'half',
                  largeButtons: true,
                  required: true,
                  space: 'containerGutter',
                }),
                buildTextField({
                  id: 'paymentInfo.spouseAllowanceUsage',
                  title:
                    socialInsuranceAdministrationMessage.payment
                      .personalAllowancePercentage,
                  suffix: '%',
                  condition: (answers) => {
                    const { spouseAllowance } = getApplicationAnswers(answers)
                    return spouseAllowance === YES
                  },
                  placeholder: '1%',
                  defaultValue: '100',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
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
          id: 'deceasedSpouse',
          title: deathBenefitsFormMessage.info.deceasedSpouseSubSection,
          children: [
            buildMultiField({
              id: 'deceasedSpouseInfo',
              title: deathBenefitsFormMessage.info.deceasedSpouseTitle,
              description:
                deathBenefitsFormMessage.info.deceasedSpouseDescription,
              condition: (_, externalData) =>
                !!getApplicationExternalData(externalData)
                  .deceasedSpouseNationalId,
              children: [
                buildTextField({
                  id: 'deceasedSpouseInfo.nationalId',
                  title: deathBenefitsFormMessage.info.deceasedSpouseNationalId,
                  width: 'half',
                  defaultValue: (application: Application) =>
                    getApplicationExternalData(application.externalData)
                      .deceasedSpouseNationalId,
                  disabled: true,
                }),
                buildDateField({
                  id: 'deceasedSpouseInfo.date',
                  title: deathBenefitsFormMessage.info.deceasedSpouseDate,
                  width: 'half',
                  defaultValue: (application: Application) =>
                    getApplicationExternalData(application.externalData)
                      .deceasedSpouseDateOfDeath,
                  disabled: true,
                }),
                buildTextField({
                  id: 'deceasedSpouseInfo.name',
                  title: deathBenefitsFormMessage.info.deceasedSpouseName,
                  defaultValue: (application: Application) =>
                    getApplicationExternalData(application.externalData)
                      .deceasedSpouseName,
                  disabled: true,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'childrenSection',
          title: deathBenefitsFormMessage.info.childrenTitle,
          condition: (_, externalData) => {
            const { children } = getApplicationExternalData(externalData)
            // if no children returned, dont show the table
            if (!children || children.length === 0) return false
            return true
          },
          children: [
            buildMultiField({
              id: 'children',
              title: deathBenefitsFormMessage.info.childrenTitle,
              description: deathBenefitsFormMessage.info.childrenDescription,
              children: [
                buildStaticTableField({
                  header: [
                    socialInsuranceAdministrationMessage.confirm.name,
                    socialInsuranceAdministrationMessage.confirm.nationalId,
                  ],
                  rows: ({ externalData }) => {
                    const children = getChildren(externalData)
                    return children.map((child) => [
                      child.fullName ?? '',
                      formatKennitala(child.nationalId ?? ''),
                    ])
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'expectingChildSection',
          title: deathBenefitsFormMessage.info.expectingChildTitle,
          condition: (_, externalData) => {
            const spouseAtLeast1Year =
              getApplicationExternalData(
                externalData,
              ).deceasedSpouseCohabitationLongerThan1Year
            // If cohabitation has lasted less than a year or is undefined, show question
            if (spouseAtLeast1Year !== true) return true
            return false
          },
          children: [
            buildMultiField({
              id: 'expectingChild',
              title: deathBenefitsFormMessage.info.expectingChildTitle,
              description:
                deathBenefitsFormMessage.info.expectingChildDescription,
              children: [
                buildRadioField({
                  id: 'expectingChild.question',
                  options: getYesNoOptions(),
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          condition: (answers) => {
            const { isExpectingChild } = getApplicationAnswers(answers)
            return isExpectingChild === YES
          },
          id: 'expectingChild.fileUpload.section',
          title: deathBenefitsFormMessage.info.expectingChildFileUpload,
          children: [
            buildFileUploadField({
              id: 'fileUpload.expectingChild',
              title: deathBenefitsFormMessage.info.expectingChildFileUpload,
              description:
                deathBenefitsFormMessage.info
                  .expectingChildFileUploadDescription,
              introduction:
                deathBenefitsFormMessage.info
                  .expectingChildFileUploadDescription,
              ...fileUploadSharedProps,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInfo',
      title: socialInsuranceAdministrationMessage.additionalInfo.section,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title:
            socialInsuranceAdministrationMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title:
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalFileTitle,
              description:
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalFileDescription,
              introduction:
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalFileDescription,
              ...fileUploadSharedProps,
            }),
          ],
        }),
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
      alertMessage: deathBenefitsFormMessage.conclusionScreen.alertMessage,
      expandableDescription:
        deathBenefitsFormMessage.conclusionScreen.bulletList,
      expandableIntro: deathBenefitsFormMessage.conclusionScreen.nextStepsText,
    }),
  ],
})
