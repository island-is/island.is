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
  getCurrencies,
  getTaxOptions,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getDefaultBank,
  getDefaultBankAccountType,
  getDefaultBankAddress,
  getDefaultBankName,
  getDefaultCurrency,
  getDefaultIban,
  getDefaultSwift,
  getPaymentAlertMessage,
} from '../../../utils/oldAgePensionUtils'
import { hasSpouse, isBankAccountType } from '../../../utils/conditionUtils'

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
          message: getPaymentAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
        }),
        buildRadioField({
          id: 'paymentInfo.bankAccountType',
          defaultValue: getDefaultBankAccountType,
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
          defaultValue: getDefaultBank,
          condition: (answers, externalData) =>
            isBankAccountType(answers, externalData, BankAccountType.ICELANDIC),
          marginTop: 2,
        }),
        buildTextField({
          id: 'paymentInfo.iban',
          title: socialInsuranceAdministrationMessage.payment.iban,
          placeholder: 'AB00 XXXX XXXX XXXX XXXX XX',
          defaultValue: getDefaultIban,
          condition: (answers, externalData) =>
            isBankAccountType(answers, externalData, BankAccountType.FOREIGN),
        }),
        buildTextField({
          id: 'paymentInfo.swift',
          title: socialInsuranceAdministrationMessage.payment.swift,
          placeholder: 'AAAA BB CC XXX',
          width: 'half',
          defaultValue: getDefaultSwift,
          condition: (answers, externalData) =>
            isBankAccountType(answers, externalData, BankAccountType.FOREIGN),
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
          defaultValue: getDefaultCurrency,
          condition: (answers, externalData) =>
            isBankAccountType(answers, externalData, BankAccountType.FOREIGN),
        }),
        buildTextField({
          id: 'paymentInfo.bankName',
          title: socialInsuranceAdministrationMessage.payment.bankName,
          width: 'half',
          defaultValue: getDefaultBankName,
          condition: (answers, externalData) =>
            isBankAccountType(answers, externalData, BankAccountType.FOREIGN),
        }),
        buildTextField({
          id: 'paymentInfo.bankAddress',
          title: socialInsuranceAdministrationMessage.payment.bankAddress,
          width: 'half',
          defaultValue: getDefaultBankAddress,
          condition: (answers, externalData) =>
            isBankAccountType(answers, externalData, BankAccountType.FOREIGN),
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
          condition: (_, externalData) => hasSpouse(externalData),
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
