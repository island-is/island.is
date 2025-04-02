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
import {
  getCapitalNumbersOverviewNumbers,
  getOverviewNumbers,
} from './overviewUtils'
import { BOARDMEMEBER } from './constants'

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
  const {
    careIncome,
    burialRevenue,
    grantFromTheCemeteryFund,
    otherIncome,
    totalIncome,
  } = getOverviewNumbers(answers)

  return [
    {
      width: 'half',
      keyText: m.careIncome,
      valueText: formatCurrency(careIncome ?? ''),
    },
    {
      width: 'half',
      keyText: m.burialRevenue,
      valueText: formatCurrency(burialRevenue ?? ''),
    },
    {
      width: 'half',
      keyText: m.grantFromTheCemeteryFund,
      valueText: formatCurrency(grantFromTheCemeteryFund ?? ''),
    },
    {
      width: 'half',
      keyText: m.otherIncome,
      valueText: formatCurrency(otherIncome ?? ''),
    },
    {
      width: 'full',
      keyText: m.totalIncome,
      valueText: formatCurrency(totalIncome ?? ''),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const expensesOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    payroll,
    funeralCost,
    chapelExpense,
    donationsToCemeteryFund,
    donationsToOther,
    otherOperationCost,
    depreciation,
    totalExpenses,
  } = getOverviewNumbers(answers)
  return [
    {
      width: 'half',
      keyText: m.payroll,
      valueText: formatCurrency(payroll ?? ''),
    },
    {
      width: 'half',
      keyText: m.funeralCost,
      valueText: formatCurrency(funeralCost ?? ''),
    },
    {
      width: 'half',
      keyText: m.chapelExpense,
      valueText: formatCurrency(chapelExpense ?? ''),
    },
    {
      width: 'half',
      keyText: m.donationsToCemeteryFund,
      valueText: formatCurrency(donationsToCemeteryFund ?? ''),
    },
    {
      width: 'half',
      keyText: m.donationsToOther,
      valueText: formatCurrency(donationsToOther ?? ''),
    },
    {
      width: 'half',
      keyText: m.otherOperationCost,
      valueText: formatCurrency(otherOperationCost ?? ''),
    },
    {
      width: 'half',
      keyText: m.depreciation,
      valueText: formatCurrency(depreciation ?? ''),
    },
    {
      width: 'full',
      keyText: m.totalExpenses,
      valueText: formatCurrency(totalExpenses ?? ''),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const capitalNumbersOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { capitalIncome, capitalCost, totalCapital } =
    getCapitalNumbersOverviewNumbers(answers)

  return [
    {
      width: 'half',
      keyText: m.capitalIncome,
      valueText: formatCurrency(capitalIncome ?? ''),
    },
    {
      width: 'half',
      keyText: m.capitalCost,
      valueText: formatCurrency(capitalCost ?? ''),
    },
    {
      width: 'full',
      keyText: m.totalCapital,
      valueText: formatCurrency(totalCapital ?? ''),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const assetsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { fixedAssetsTotal, currentAssets, totalAssets } =
    getOverviewNumbers(answers)
  return [
    {
      width: 'half',
      keyText: m.fixedAssetsTotal,
      valueText: formatCurrency(fixedAssetsTotal ?? ''),
    },
    {
      width: 'half',
      keyText: m.currentAssets,
      valueText: formatCurrency(currentAssets ?? ''),
    },
    {
      width: 'full',
      keyText: m.totalAssets,
      valueText: formatCurrency(totalAssets ?? ''),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const debtsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { longTerm, shortTerm, totalLiabilities } = getOverviewNumbers(answers)
  return [
    {
      width: 'half',
      keyText: m.longTerm,
      valueText: formatCurrency(longTerm ?? ''),
    },
    {
      width: 'half',
      keyText: m.shortTerm,
      valueText: formatCurrency(shortTerm ?? ''),
    },
    {
      width: 'full',
      keyText: m.totalLiabilities,
      valueText: formatCurrency(totalLiabilities ?? ''),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const equityOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    equityAtTheBeginningOfTheYear,
    revaluationDueToPriceChanges,
    reevaluateOther,
    operationResult,
    totalEquity,
  } = getOverviewNumbers(answers)

  return [
    {
      width: 'half',
      keyText: m.equityAtTheBeginningOfTheYear,
      valueText: formatCurrency(equityAtTheBeginningOfTheYear ?? ''),
    },
    {
      width: 'half',
      keyText: m.revaluationDueToPriceChanges,
      valueText: formatCurrency(revaluationDueToPriceChanges ?? ''),
    },
    {
      width: 'half',
      keyText: m.reevaluateOther,
      valueText: formatCurrency(reevaluateOther ?? ''),
    },
    {
      width: 'half',
      keyText: m.operationResult,
      valueText: formatCurrency(operationResult ?? ''),
    },
    {
      width: 'full',
      keyText: m.totalEquity,
      valueText: formatCurrency(totalEquity ?? ''),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const boardMembersOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { cemeteryCaretakers } = getOverviewNumbers(answers)

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
