import {
  YES,
  YesOrNo,
  buildAlertMessageField,
  buildAsyncSelectField,
  buildBankAccountField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  BankAccountType,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getCurrencies,
  getTaxOptions,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application, FormValue } from '@island.is/application/types'
import isEmpty from 'lodash/isEmpty'
import { SectionRouteEnum } from '../../../types/routes'
import { accountNationality, getApplicationExternalData } from '../../../utils'
import { siaGeneralCurrenciesQuery } from '../../../graphql/queries'
import * as m from '../../../lib/messages'
import { Query } from '@island.is/api/schema'

export const paymentInfoSubSection = buildSubSection({
  id: SectionRouteEnum.PAYMENT_INFO,
  tabTitle: m.basicInfo.paymentInfo,
  title: m.basicInfo.paymentInfo,
  children: [
    buildMultiField({
      space: 'gutter',
      title: m.basicInfo.paymentInfo,
      id: SectionRouteEnum.PAYMENT_INFO,
      children: [
        buildAlertMessageField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.notice`,
          alertType: 'info',
          title: m.paymentInfo.noticeTitle,
          message: m.paymentInfo.notice,
        }),
        buildRadioField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.bankAccountType`,
          title: m.paymentInfo.accountType,
          width: 'full',
          largeButtons: false,
          required: true,
          options: [
            {
              value: BankAccountType.ICELANDIC,
              label: sm.payment.icelandicBankAccount,
            },
            {
              value: BankAccountType.FOREIGN,
              label: m.paymentInfo.foreignAccount,
            },
          ],
        }),
        buildDescriptionField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.alertMessage`,
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.FOREIGN,
          description: m.paymentInfo.foreignAccountNotice,
        }),
        buildBankAccountField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.bank`,
          required: true,
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.ICELANDIC,
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return { ...bankInfo, bankNumber: bankInfo?.bank }
          },
        }),
        buildTextField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.iban`,
          title: sm.payment.iban,
          placeholder: 'AB00 XXXX XXXX XXXX XXXX XX',
          required: true,
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return friendlyFormatIBAN(bankInfo?.iban)
          },
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.FOREIGN,
        }),
        buildTextField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.swift`,
          title: sm.payment.swift,
          placeholder: 'AAAA BB CC XXX',
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return friendlyFormatSWIFT(bankInfo?.swift)
          },
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.FOREIGN,
        }),
        buildAsyncSelectField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.currency`,
          title: sm.payment.currency,
          width: 'half',
          required: true,
          placeholder: sm.payment.selectCurrency,
          loadOptions: async ({ apolloClient }) => {
            const { data } = await apolloClient.query<Query>({
              query: siaGeneralCurrenciesQuery,
            })
            return getCurrencies(data.socialInsuranceGeneral.currencies ?? [])
          },
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return !isEmpty(bankInfo) ? bankInfo.currency : ''
          },
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.FOREIGN,
        }),
        buildTextField({
          id: 'paymentInfo.bankName',
          title: sm.payment.bankName,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return bankInfo?.foreignBankName ? bankInfo.foreignBankName : ''
          },
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.FOREIGN,
        }),
        buildTextField({
          id: 'paymentInfo.bankAddress',
          title: m.paymentInfo.bankAddress,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return bankInfo?.foreignBankAddress
              ? bankInfo.foreignBankAddress
              : ''
          },
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.FOREIGN,
        }),
        buildRadioField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.personalAllowance`,
          title: m.paymentInfo.personalAllowance,
          width: 'half',
          options: getYesNoOptions(),
          largeButtons: true,
          required: true,
        }),
        buildTextField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.personalAllowanceUsage`,
          title: sm.payment.personalAllowancePercentage,
          suffix: '%',
          dataTestId: 'personal-allowance-usage',
          condition: (formValue: FormValue) => {
            const personalAllowance = getValueViaPath<YesOrNo>(
              formValue,
              `${SectionRouteEnum.PAYMENT_INFO}.personalAllowance`,
            )
            return personalAllowance === YES
          },
          placeholder: sm.payment.personalAllowancePlaceholder,
          defaultValue: '100',
          variant: 'number',
          width: 'half',
          maxLength: 4,
          min: 0,
          max: 100,
        }),
        buildRadioField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.taxLevel`,
          title: sm.payment.taxLevel,
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
