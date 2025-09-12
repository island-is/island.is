import {
  YES,
  YesOrNo,
  buildAlertMessageField,
  buildAsyncSelectField,
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
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getCurrencies,
  getTaxOptions,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application, FormValue } from '@island.is/application/types'
import isEmpty from 'lodash/isEmpty'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { accountNationality, getApplicationExternalData } from '../../../utils'
import { siaGeneralCurrencies } from '../../../graphql/queries'
import { SocialInsuranceGeneralCurrenciesQuery } from '../../../types/schema'

export const paymentInfoSubSection = buildSubSection({
  id: SectionRouteEnum.PAYMENT_INFO,
  tabTitle: disabilityPensionFormMessage.basicInfo.paymentInfo,
  title: disabilityPensionFormMessage.basicInfo.paymentInfo,
  children: [
    buildMultiField({
      space: 'gutter',
      title: disabilityPensionFormMessage.basicInfo.paymentInfo,
      id: SectionRouteEnum.PAYMENT_INFO,
      children: [
        buildAlertMessageField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.notice`,
          alertType: 'info',
          title: disabilityPensionFormMessage.paymentInfo.noticeTitle,
          message: disabilityPensionFormMessage.paymentInfo.notice,
        }),
        buildRadioField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.bankAccountType`,
          title: disabilityPensionFormMessage.paymentInfo.accountType,
          width: 'full',
          largeButtons: false,
          required: true,
          backgroundColor: 'white',
          options: [
            {
              value: BankAccountType.ICELANDIC,
              label:
                socialInsuranceAdministrationMessage.payment
                  .icelandicBankAccount,
            },
            {
              value: BankAccountType.FOREIGN,
              label: disabilityPensionFormMessage.paymentInfo.foreignAccount,
            },
          ],
        }),
        buildDescriptionField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.alertMessage`,
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.FOREIGN,
          description:
            disabilityPensionFormMessage.paymentInfo.foreignAccountNotice,
        }),
        buildTextField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.bank`,
          title: disabilityPensionFormMessage.paymentInfo.bank,
          placeholder: '0000-00-000000',
          required: true,
          condition: (formValue: FormValue) =>
            accountNationality(formValue) === BankAccountType.ICELANDIC,
          backgroundColor: 'blue',
        }),
        buildTextField({
          id: `${SectionRouteEnum.PAYMENT_INFO}.iban`,
          title: socialInsuranceAdministrationMessage.payment.iban,
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
          title: socialInsuranceAdministrationMessage.payment.swift,
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
          title: socialInsuranceAdministrationMessage.payment.currency,
          width: 'half',
          required: true,
          placeholder:
            socialInsuranceAdministrationMessage.payment.selectCurrency,
          loadOptions: async ({ apolloClient }) => {
            const { data } =
              await apolloClient.query<SocialInsuranceGeneralCurrenciesQuery>({
                query: siaGeneralCurrencies,
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
          title: socialInsuranceAdministrationMessage.payment.bankName,
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
          title: disabilityPensionFormMessage.paymentInfo.bankAddress,
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
              `${SectionRouteEnum.PAYMENT_INFO}.personalAllowance`,
            )
            return personalAllowance === YES
          },
          placeholder: '1%',
          defaultValue: '100',
          variant: 'number',
          width: 'half',
          maxLength: 4,
          min: 0,
          max: 100,
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
