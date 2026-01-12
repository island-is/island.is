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
  return [
    {
      width: 'half',
      keyText: m.contributionsFromLegalEntities,
      valueText: format(
        answers,
        'individualIncome.contributionsByLegalEntities',
      ),
    },
    {
      width: 'half',
      keyText: m.contributionsFromIndividuals,
      valueText: format(answers, 'individualIncome.individualContributions'),
    },
    {
      width: 'half',
      keyText: m.candidatesOwnContributions,
      valueText: format(answers, 'individualIncome.candidatesOwnContributions'),
    },
    {
      width: 'half',
      keyText: m.otherIncome,
      valueText: format(answers, 'individualIncome.otherIncome'),
    },
    {
      width: 'full',
      keyText: m.totalIncome,
      valueText: format(answers, 'individualIncome.total'),
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
      keyText: m.electionOffice,
      valueText: format(answers, 'individualExpense.electionOffice'),
    },
    {
      width: 'half',
      keyText: m.advertisements,
      valueText: format(answers, 'individualExpense.advertisements'),
    },
    {
      width: 'half',
      keyText: m.travelCost,
      valueText: format(answers, 'individualExpense.travelCost'),
    },
    {
      width: 'half',
      keyText: m.otherCost,
      valueText: format(answers, 'individualExpense.otherCost'),
    },
    {
      width: 'full',
      keyText: m.totalExpenses,
      valueText: format(answers, 'individualExpense.total'),
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
      valueText: format(answers, 'asset.fixedAssetsTotal'),
    },
    {
      width: 'half',
      keyText: m.currentAssets,
      valueText: format(answers, 'asset.currentAssets'),
    },
    {
      width: 'full',
      keyText: m.totalAssets,
      valueText: format(answers, 'asset.total'),
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
      valueText: format(answers, 'liability.longTerm'),
    },
    {
      width: 'half',
      keyText: m.shortTerm,
      valueText: format(answers, 'liability.shortTerm'),
    },
    {
      width: 'full',
      keyText: m.totalLiabilities,
      valueText: format(answers, 'liability.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const debtsAndCashOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      valueText: format(answers, 'equityAndLiabilities.total'),
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
