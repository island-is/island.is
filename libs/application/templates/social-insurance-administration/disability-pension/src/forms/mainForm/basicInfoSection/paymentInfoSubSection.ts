import {
  YES,
  YesOrNo,
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import { BankAccountType, TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { accountNationality } from '../../../lib/utils'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { BankInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import { friendlyFormatIBAN, friendlyFormatSWIFT, getCurrencies, getTaxOptions, getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import isEmpty from 'lodash/isEmpty'

const paymentInfoRoute = 'paymentInfo'

export const paymentInfoSubSection =
    buildSubSection({
      id: paymentInfoRoute,
      tabTitle: disabilityPensionFormMessage.basicInfo.paymentInfo,
      title: disabilityPensionFormMessage.basicInfo.paymentInfo,
      children: [
        buildMultiField({
          space: 'gutter',
          id: paymentInfoRoute,
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.basicInfo.paymentInfo,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildAlertMessageField({
              id: `${paymentInfoRoute}.notice`,
              alertType: 'info',
              title: disabilityPensionFormMessage.paymentInfo.noticeTitle,
              message: disabilityPensionFormMessage.paymentInfo.notice,
            }),
            buildRadioField({
              id: `${paymentInfoRoute}.accountType`,
              title: disabilityPensionFormMessage.paymentInfo.accountType,
              width: 'full',
              largeButtons: false,
              required: true,
              backgroundColor: 'white',
              options: [
                {
                  value: BankAccountType.ICELANDIC,
                  label: socialInsuranceAdministrationMessage.payment.icelandicBankAccount,
                },
                {
                  value: BankAccountType.FOREIGN,
                  label: disabilityPensionFormMessage.paymentInfo.foreignAccount,
                },
              ],
            }),
            buildDescriptionField({
              id: `${paymentInfoRoute}.alertMessage`,
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.FOREIGN,
              description: disabilityPensionFormMessage.paymentInfo.foreignAccountNotice,
            }),
            buildTextField({
              id: `${paymentInfoRoute}.bank`,
              title: disabilityPensionFormMessage.paymentInfo.bank,
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.ICELANDIC,
              backgroundColor: 'blue',
              }),
            buildTextField({
              id: `${paymentInfoRoute}.iban`,
              title: socialInsuranceAdministrationMessage.payment.iban,
              placeholder: 'AB00 XXXX XXXX XXXX XXXX XX',
              defaultValue: (application: Application) => {
                const bankInfo = getValueViaPath<BankInfo>(
                  application.externalData,
                  'socialInsuranceAdministrationApplicant.data.bankAccount',
                )

                return friendlyFormatIBAN(bankInfo?.iban)
              },
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.FOREIGN,
            }),
            buildTextField({
              id: `${paymentInfoRoute}.swift`,
              title: socialInsuranceAdministrationMessage.payment.swift,
              placeholder: 'AAAA BB CC XXX',
              width: 'half',
              defaultValue: (application: Application) => {
                const bankInfo = getValueViaPath<BankInfo>(
                  application.externalData,
                  'socialInsuranceAdministrationApplicant.data.bankAccount',
                )
                return friendlyFormatSWIFT(bankInfo?.swift)
              },
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.FOREIGN,
            }),
            buildSelectField({
              id: `${paymentInfoRoute}.currency`,
              title: socialInsuranceAdministrationMessage.payment.currency,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.payment.selectCurrency,
              options: ({ externalData }: Application) => {
                const currencies = getValueViaPath<Array<string>>(
                  externalData,
                  'socialInsuranceAdministrationCurrencies.data',
                ) ?? []
                return getCurrencies(currencies)
              },
              defaultValue: (application: Application) => {
                const bankInfo = getValueViaPath<BankInfo>(
                 application.externalData,
                  'socialInsuranceAdministrationApplicant.data.bankAccount',
                )
                return !isEmpty(bankInfo) ? bankInfo.currency : ''
              },
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.FOREIGN,
            }),
            buildTextField({
              id: 'paymentInfo.bankName',
              title: socialInsuranceAdministrationMessage.payment.bankName,
              width: 'half',
              defaultValue: (application: Application) => {
                const bankInfo = getValueViaPath<BankInfo>(
                 application.externalData,
                  'socialInsuranceAdministrationApplicant.data.bankAccount',
                )
                return bankInfo?.foreignBankName ? bankInfo.foreignBankName : ''
              },
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.FOREIGN,
            }),
            buildTextField({
              id: 'paymentInfo.bankAddress',
              title:
                socialInsuranceAdministrationMessage.payment.bankAddress,
              width: 'half',
              defaultValue: (application: Application) => {
                const bankInfo = getValueViaPath<BankInfo>(
                 application.externalData,
                  'socialInsuranceAdministrationApplicant.data.bankAccount',
                )
                return bankInfo?.foreignBankAddress ? bankInfo.foreignBankAddress : ''
              },
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.FOREIGN,

            }),
            buildRadioField({
              id: `${paymentInfoRoute}.usePersonalAllowance`,
              title: disabilityPensionFormMessage.paymentInfo.personalAllowance,
              width: 'half',
              options: getYesNoOptions(),
              largeButtons: true,
              required: true,
            }),
            buildTextField({
              id: `${paymentInfoRoute}.personalAllowanceUsage`,
              title:
                socialInsuranceAdministrationMessage.payment
                  .personalAllowancePercentage,
              suffix: '%',
              dataTestId: 'personal-allowance-usage',
              condition: (formValue: FormValue) => {
                const personalAllowance = getValueViaPath<YesOrNo>(
                 formValue,
                 `${paymentInfoRoute}.usePersonalAllowance`,
                )
                return personalAllowance === YES
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
    })
