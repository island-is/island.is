import {
  buildAlertMessageField,
  buildBankAccountField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import {
  BankAccountType,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getCurrencies,
  getTaxOptions,
  getYesNoOptions,
  typeOfBankInfo,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import isEmpty from 'lodash/isEmpty'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../utils/oldAgePensionUtils'

export const paymentInfoSubSection = buildSubSection({
  id: 'paymentInfoSubSection',
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
            const { paymentInfo } = getApplicationAnswers(application.answers)
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )

            const type =
              paymentInfo?.bankAccountType ??
              typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)

            return type === BankAccountType.ICELANDIC
              ? socialInsuranceAdministrationMessage.payment.alertMessage
              : socialInsuranceAdministrationMessage.payment.alertMessageForeign
          },
          doesNotRequireAnswer: true,
          alertType: 'info',
        }),
        buildRadioField({
          id: 'paymentInfo.bankAccountType',
          defaultValue: (application: Application) => {
            const { paymentInfo } = getApplicationAnswers(application.answers)
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )

            return typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
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
                socialInsuranceAdministrationMessage.payment.foreignBankAccount,
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
          condition: (answers, externalData) => {
            const { paymentInfo } = getApplicationAnswers(answers)
            const { bankInfo } = getApplicationExternalData(externalData)

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
          condition: (answers, externalData) => {
            const { paymentInfo } = getApplicationAnswers(answers)
            const { bankInfo } = getApplicationExternalData(externalData)

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
          condition: (answers, externalData) => {
            const { paymentInfo } = getApplicationAnswers(answers)
            const { bankInfo } = getApplicationExternalData(externalData)

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
            const { currencies } = getApplicationExternalData(externalData)
            return getCurrencies(currencies)
          },
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return !isEmpty(bankInfo) ? bankInfo.currency : ''
          },
          condition: (answers, externalData) => {
            const { paymentInfo } = getApplicationAnswers(answers)
            const { bankInfo } = getApplicationExternalData(externalData)

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
          condition: (answers, externalData) => {
            const { paymentInfo } = getApplicationAnswers(answers)
            const { bankInfo } = getApplicationExternalData(externalData)

            const radio =
              paymentInfo?.bankAccountType ??
              typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
            return radio === BankAccountType.FOREIGN
          },
        }),
        buildTextField({
          id: 'paymentInfo.bankAddress',
          title: socialInsuranceAdministrationMessage.payment.bankAddress,
          width: 'half',
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return !isEmpty(bankInfo) ? bankInfo.foreignBankAddress : ''
          },
          condition: (answers, externalData) => {
            const { paymentInfo } = getApplicationAnswers(answers)
            const { bankInfo } = getApplicationExternalData(externalData)

            const radio =
              paymentInfo?.bankAccountType ??
              typeOfBankInfo(bankInfo, paymentInfo?.bankAccountType)
            return radio === BankAccountType.FOREIGN
          },
        }),
        buildRadioField({
          id: 'paymentInfo.personalAllowance',
          title: socialInsuranceAdministrationMessage.payment.personalAllowance,
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
            socialInsuranceAdministrationMessage.payment.alertSpouseAllowance,
          doesNotRequireAnswer: true,
          alertType: 'info',
          condition: (_, externalData) => {
            const { hasSpouse } = getApplicationExternalData(externalData)
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
})
