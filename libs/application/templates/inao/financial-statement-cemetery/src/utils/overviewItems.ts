import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import {
  formatCurrency,
  formatPhoneNumberWithIcelandicCountryCode,
} from '@island.is/application/ui-components'
import { BOARDMEMEBER } from './constants'
import { CareTaker } from '../types/types'

const format = (answers: FormValue, path: string) => {
  return formatCurrency(getValueViaPath<string>(answers, path) ?? '')
}

export const aboutOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.fullName,
      valueText: getValueViaPath(answers, 'about.fullName') ?? '',
    },
    {
      width: 'half',
      keyText: m.nationalId,
      valueText: formatNationalId(
        getValueViaPath(answers, 'about.nationalId') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.powerOfAttorneyName,
      valueText: getValueViaPath(answers, 'about.powerOfAttorneyName') ?? '',
    },
    {
      width: 'half',
      keyText: m.powerOfAttorneyNationalId,
      valueText: formatNationalId(
        getValueViaPath(answers, 'about.powerOfAttorneyNationalId') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.email,
      valueText: getValueViaPath(answers, 'about.email') ?? '',
    },
    {
      width: 'half',
      keyText: m.phoneNumber,
      valueText: formatPhoneNumberWithIcelandicCountryCode(
        getValueViaPath(answers, 'about.phoneNumber') ?? '',
      ),
    },
  ]
}

export const incomeOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.careIncome,
      valueText: format(answers, 'cemeteryIncome.careIncome'),
    },
    {
      width: 'half',
      keyText: m.burialRevenue,
      valueText: format(answers, 'cemeteryIncome.burialRevenue'),
    },
    {
      width: 'half',
      keyText: m.grantFromTheCemeteryFund,
      valueText: format(answers, 'cemeteryIncome.grantFromTheCemeteryFund'),
    },
    {
      width: 'half',
      keyText: m.otherIncome,
      valueText: format(answers, 'cemeteryIncome.otherIncome'),
    },
    {
      width: 'full',
      keyText: m.totalIncome,
      valueText: format(answers, 'cemeteryIncome.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const expensesOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.payroll,
      valueText: format(answers, 'cemeteryExpense.payroll'),
    },
    {
      width: 'half',
      keyText: m.funeralCost,
      valueText: format(answers, 'cemeteryExpense.funeralCost'),
    },
    {
      width: 'half',
      keyText: m.chapelExpense,
      valueText: format(answers, 'cemeteryExpense.chapelExpense'),
    },
    {
      width: 'half',
      keyText: m.donationsToCemeteryFund,
      valueText: format(answers, 'cemeteryExpense.cemeteryFundExpense'),
    },
    {
      width: 'half',
      keyText: m.donationsToOther,
      valueText: format(answers, 'cemeteryExpense.donationsToOther'),
    },
    {
      width: 'half',
      keyText: m.otherOperationCost,
      valueText: format(answers, 'cemeteryExpense.otherOperationCost'),
    },
    {
      width: 'half',
      keyText: m.depreciation,
      valueText: format(answers, 'cemeteryExpense.depreciation'),
    },
    {
      width: 'full',
      keyText: m.totalExpenses,
      valueText: format(answers, 'cemeteryExpense.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const capitalNumbersOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.capitalIncome,
      valueText: format(answers, 'capitalNumbers.capitalIncome'),
    },
    {
      width: 'half',
      keyText: m.capitalCost,
      valueText: format(answers, 'capitalNumbers.capitalCost'),
    },
    {
      width: 'full',
      keyText: m.totalCapital,
      valueText: format(answers, 'capitalNumbers.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const assetsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.fixedAssetsTotal,
      valueText: format(answers, 'cemeteryAsset.fixedAssetsTotal'),
    },
    {
      width: 'half',
      keyText: m.currentAssets,
      valueText: format(answers, 'cemeteryAsset.currentAssets'),
    },
    {
      width: 'full',
      keyText: m.totalAssets,
      valueText: format(answers, 'assetsTotal'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const debtsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.longTerm,
      valueText: format(answers, 'cemeteryLiability.longTerm'),
    },
    {
      width: 'half',
      keyText: m.shortTerm,
      valueText: format(answers, 'cemeteryLiability.shortTerm'),
    },
    {
      width: 'full',
      keyText: m.totalLiabilities,
      valueText: format(answers, 'equityAndLiabilitiesTotals.liabilitiesTotal'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const equityOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.equityAtTheBeginningOfTheYear,
      valueText: format(
        answers,
        'cemeteryEquity.equityAtTheBeginningOfTheYear',
      ),
    },
    {
      width: 'half',
      keyText: m.revaluationDueToPriceChanges,
      valueText: format(answers, 'cemeteryEquity.revaluationDueToPriceChanges'),
    },
    {
      width: 'half',
      keyText: m.reevaluateOther,
      valueText: format(answers, 'cemeteryEquity.reevaluateOther'),
    },
    {
      width: 'half',
      keyText: m.operationResult,
      valueText: format(answers, 'cemeteryEquity.operationResult'),
    },
    {
      width: 'full',
      keyText: m.totalEquity,
      valueText: format(answers, 'cemeteryEquity.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const boardMembersOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const cemeteryCaretakers = getValueViaPath<Array<CareTaker>>(
    answers,
    'cemeteryCaretaker',
  )

  const parsedCaretakers = cemeteryCaretakers?.map((careTaker, i) => {
    const divider =
      i === 0
        ? []
        : [
            {
              width: 'full',
              lineAboveKeyText: true,
            },
          ]

    return [
      ...divider,
      {
        width: 'half',
        keyText: m.fullName,
        valueText: careTaker.name,
      },
      {
        width: 'half',
        keyText: m.nationalId,
        valueText: formatNationalId(careTaker.nationalId),
      },
      {
        width: 'half',
        keyText: m.role,
        valueText:
          careTaker.role === BOARDMEMEBER
            ? m.cemeteryBoardMember
            : m.cemeteryInspector,
      },
    ]
  })

  return parsedCaretakers?.flat() as Array<KeyValueItem>
}

export const cemeteryEquitiesAndLiabilitiesOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      valueText: formatCurrency(
        getValueViaPath<string>(
          answers,
          'equityAndLiabilitiesTotals.equityAndLiabilitiesTotal',
        ) ?? '',
      ),
    },
  ]
}

export const attachmentsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const file = getValueViaPath<Array<File>>(answers, 'attachments.file')
  const fileName = file?.[0]?.name
  return [
    {
      width: 'full',
      fileName: fileName ?? '',
      fileType: '.pdf',
    },
  ]
}
