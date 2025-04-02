import { getValueViaPath } from '@island.is/application/core'
import {
  AttachmentItem,
  ExternalData,
  KeyValueItem,
} from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { FormValue } from '@island.is/application/types'
import { m } from '../lib/messages'
import {
  formatCurrency,
  formatPhoneNumber,
} from '@island.is/application/ui-components'

const getAndFormatCurrency = (answers: FormValue, path: string) => {
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
      valueText: getValueViaPath(answers, 'about.fullName'),
    },
    {
      width: 'half',
      keyText: m.nationalId,
      valueText: formatNationalId(
        getValueViaPath<string>(answers, 'about.nationalId') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.email,
      valueText: getValueViaPath(answers, 'about.email'),
    },
    {
      width: 'half',
      keyText: m.phoneNumber,
      valueText: formatPhoneNumber(
        getValueViaPath<string>(answers, 'about.phoneNumber') ?? '',
      ),
    },
  ]
}

export const incomeOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const format = (path: string) => getAndFormatCurrency(answers, path)
  return [
    {
      width: 'half',
      keyText: m.contributionsFromLegalEntities,
      valueText: format('individualIncome.contributionsByLegalEntities'),
    },
    {
      width: 'half',
      keyText: m.contributionsFromIndividuals,
      valueText: format('individualIncome.individualContributions'),
    },
    {
      width: 'half',
      keyText: m.candidatesOwnContributions,
      valueText: format('individualIncome.candidatesOwnContributions'),
    },
    {
      width: 'half',
      keyText: m.otherIncome,
      valueText: format('individualIncome.otherIncome'),
    },
    {
      width: 'full',
      keyText: m.totalIncome,
      valueText: format('individualIncome.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const expensesOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const format = (path: string) => getAndFormatCurrency(answers, path)
  return [
    {
      width: 'half',
      keyText: m.electionOffice,
      valueText: format('individualExpense.electionOffice'),
    },
    {
      width: 'half',
      keyText: m.advertisements,
      valueText: format('individualExpense.advertisements'),
    },
    {
      width: 'half',
      keyText: m.travelCost,
      valueText: format('individualExpense.travelCost'),
    },
    {
      width: 'half',
      keyText: m.otherCost,
      valueText: format('individualExpense.otherCost'),
    },
    {
      width: 'full',
      keyText: m.totalExpenses,
      valueText: format('individualExpense.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const capitalNumbersOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const format = (path: string) => getAndFormatCurrency(answers, path)
  return [
    {
      width: 'half',
      keyText: m.capitalIncome,
      valueText: format('capitalNumbers.capitalIncome'),
    },
    {
      width: 'half',
      keyText: m.capitalCost,
      valueText: format('capitalNumbers.capitalCost'),
    },
    {
      width: 'full',
      keyText: m.totalCapital,
      valueText: format('capitalNumbers.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const assetsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const format = (path: string) => getAndFormatCurrency(answers, path)
  return [
    {
      width: 'half',
      keyText: m.fixedAssetsTotal,
      valueText: format('asset.fixedAssetsTotal'),
    },
    {
      width: 'half',
      keyText: m.currentAssets,
      valueText: format('asset.currentAssets'),
    },
    {
      width: 'full',
      keyText: m.totalAssets,
      valueText: format('assets.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const debtsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const format = (path: string) => getAndFormatCurrency(answers, path)
  return [
    {
      width: 'half',
      keyText: m.longTerm,
      valueText: format('liability.longTerm'),
    },
    {
      width: 'half',
      keyText: m.shortTerm,
      valueText: format('liability.shortTerm'),
    },
    {
      width: 'full',
      keyText: m.totalLiabilities,
      valueText: format('liability.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const debtsAndCashOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const format = (path: string) => getAndFormatCurrency(answers, path)
  return [
    {
      width: 'full',
      valueText: format('equityAndLiabilities.total'),
    },
  ]
}

export const fileOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  return [
    {
      fileName: getValueViaPath(answers, 'attachments.file.0.name') ?? '',
      fileType: '.pdf',
    },
  ]
}
