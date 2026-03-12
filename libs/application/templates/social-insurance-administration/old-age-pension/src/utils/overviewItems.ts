import { YES } from '@island.is/application/core'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { incomePlanHasOnlyZeroIncome } from '@island.is/application/templates/social-insurance-administration-core/lib/incomePlanUtils'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  formatIcelandicBankAccount,
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getTaxLevelOption,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  FormValue,
  KeyValueItem,
  TableData,
} from '@island.is/application/types'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'
import { getApplicationAnswers } from './oldAgePensionUtils'

export const paymentItems = (answers: FormValue): Array<KeyValueItem> => {
  const { paymentInfo, personalAllowance, personalAllowanceUsage, taxLevel } =
    getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> =
    paymentInfo?.bankAccountType === BankAccountType.FOREIGN
      ? [
          {
            width: 'full',
            keyText: socialInsuranceAdministrationMessage.payment.iban,
            valueText: friendlyFormatIBAN(paymentInfo?.iban),
          },
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.payment.swift,
            valueText: friendlyFormatSWIFT(paymentInfo?.swift),
          },
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.payment.currency,
            valueText: paymentInfo?.currency,
          },
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.payment.bankName,
            valueText: paymentInfo?.bankName,
          },
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.payment.bankAddress,
            valueText: paymentInfo?.bankAddress,
          },
        ]
      : [
          {
            width: 'full',
            keyText: socialInsuranceAdministrationMessage.payment.bank,
            valueText: formatIcelandicBankAccount(paymentInfo?.bank),
          },
        ]

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: socialInsuranceAdministrationMessage.confirm.personalAllowance,
      valueText:
        personalAllowance === YES
          ? socialInsuranceAdministrationMessage.shared.yes
          : socialInsuranceAdministrationMessage.shared.no,
    },
  ]

  const personalAllowanceUsageItem: Array<KeyValueItem> =
    personalAllowance === YES
      ? [
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.confirm.ratio,
            valueText: `${personalAllowanceUsage}%`,
          },
        ]
      : []

  const baseItems3: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: socialInsuranceAdministrationMessage.payment.taxLevel,
      valueText: getTaxLevelOption(taxLevel),
    },
  ]

  return [
    ...baseItems,
    ...baseItems2,
    ...personalAllowanceUsageItem,
    ...baseItems3,
  ]
}

export const incomePlanTable = (answers: FormValue): TableData => {
  const { incomePlan } = getApplicationAnswers(answers)

  return {
    header: [
      socialInsuranceAdministrationMessage.incomePlan.incomeType,
      socialInsuranceAdministrationMessage.incomePlan.incomePerYear,
      socialInsuranceAdministrationMessage.incomePlan.currency,
    ],
    rows: incomePlan.map((e) => [
      e.incomeType,
      formatCurrencyWithoutSuffix(e.incomePerYear),
      e.currency,
    ]),
  }
}

export const incomePlanItems = (answers: FormValue): Array<KeyValueItem> => {
  const { incomePlan, noOtherIncomeConfirmation } =
    getApplicationAnswers(answers)

  return incomePlanHasOnlyZeroIncome(incomePlan)
    ? [
        {
          width: 'full',
          keyText:
            socialInsuranceAdministrationMessage.incomePlan
              .noOtherIncomeConfirmation,
          valueText:
            noOtherIncomeConfirmation === YES
              ? socialInsuranceAdministrationMessage.shared.yes
              : socialInsuranceAdministrationMessage.shared.no,
        },
      ]
    : []
}
