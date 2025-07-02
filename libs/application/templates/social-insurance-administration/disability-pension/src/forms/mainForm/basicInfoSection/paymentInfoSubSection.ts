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
import { SectionRouteEnum } from '../../../lib/routes'

export const paymentInfoSubSection =
    buildSubSection({
      id: SectionRouteEnum.PAYMENT_INFO,
      tabTitle: disabilityPensionFormMessage.basicInfo.paymentInfo,
      title: disabilityPensionFormMessage.basicInfo.paymentInfo,
      children: [
        buildMultiField({
          space: 'gutter',
          id: SectionRouteEnum.PAYMENT_INFO,
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.basicInfo.paymentInfo,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildAlertMessageField({
              id: `${SectionRouteEnum.PAYMENT_INFO}.notice`,
              alertType: 'info',
              title: disabilityPensionFormMessage.paymentInfo.noticeTitle,
              message: disabilityPensionFormMessage.paymentInfo.notice,
            }),
            buildRadioField({
              id: `${SectionRouteEnum.PAYMENT_INFO}.accountType`,
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
              id: `${SectionRouteEnum.PAYMENT_INFO}.alertMessage`,
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.FOREIGN,
              description: disabilityPensionFormMessage.paymentInfo.foreignAccountNotice,
            }),
            buildTextField({
              id: `${SectionRouteEnum.PAYMENT_INFO}.bank`,
              title: disabilityPensionFormMessage.paymentInfo.bank,
              required: true,
              condition: (formValue: FormValue) => accountNationality(formValue) === BankAccountType.ICELANDIC,
              backgroundColor: 'blue',
              }),
            buildTextField({
              id: `${SectionRouteEnum.PAYMENT_INFO}.iban`,
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
              id: `${SectionRouteEnum.PAYMENT_INFO}.swift`,
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
              id: `${SectionRouteEnum.PAYMENT_INFO}.currency`,
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
              title: socialInsuranceAdministrationMessage.payment.bank,
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
              id: `${SectionRouteEnum.PAYMENT_INFO}.usePersonalAllowance`,
              title: disabilityPensionFormMessage.paymentInfo.personalAllowance,
              width: 'half',
              options: getYesNoOptions(),
              largeButtons: true,
              required: true,
            }),
            buildTextField({
              id: `${SectionRouteEnum.PAYMENT_INFO}.personalAllowanceUsage`,
              title:
                socialInsuranceAdministrationMessage.payment
                  .personalAllowancePercentage,
              suffix: '%',
              dataTestId: 'personal-allowance-usage',
              condition: (formValue: FormValue) => {
                const personalAllowance = getValueViaPath<YesOrNo>(
                 formValue,
                 `${SectionRouteEnum.PAYMENT_INFO}.usePersonalAllowance`,
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
              id: `${SectionRouteEnum.PAYMENT_INFO}.taxLevel`,
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
