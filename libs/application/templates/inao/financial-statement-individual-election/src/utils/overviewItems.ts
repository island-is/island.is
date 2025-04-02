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
      valueText: formatCurrency(
        getValueViaPath<string>(
          answers,
          'individualIncome.contributionsByLegalEntities',
        ) ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.contributionsFromIndividuals,
      valueText: formatCurrency(
        getValueViaPath<string>(
          answers,
          'individualIncome.individualContributions',
        ) ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.candidatesOwnContributions,
      valueText: formatCurrency(
        getValueViaPath<string>(
          answers,
          'individualIncome.candidatesOwnContributions',
        ) ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.otherIncome,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'individualIncome.otherIncome') ?? '',
      ),
    },
    {
      width: 'full',
      keyText: m.totalIncome,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'individualIncome.total') ?? '',
      ),
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
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'individualExpense.electionOffice') ??
          '',
      ),
    },
    {
      width: 'half',
      keyText: m.advertisements,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'individualExpense.advertisements') ??
          '',
      ),
    },
    {
      width: 'half',
      keyText: m.travelCost,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'individualExpense.travelCost') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.otherCost,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'individualExpense.otherCost') ?? '',
      ),
    },
    {
      width: 'full',
      keyText: m.totalExpenses,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'individualExpense.total') ?? '',
      ),
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
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'capitalNumbers.capitalIncome') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.capitalCost,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'capitalNumbers.capitalCost') ?? '',
      ),
    },
    {
      width: 'full',
      keyText: m.totalCapital,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'capitalNumbers.total') ?? '',
      ),
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
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'asset.fixedAssetsTotal') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.currentAssets,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'asset.currentAssets') ?? '',
      ),
    },
    {
      width: 'full',
      keyText: m.totalAssets,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'assets.total') ?? '',
      ),
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
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'liability.longTerm') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.shortTerm,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'liability.shortTerm') ?? '',
      ),
    },
    {
      width: 'full',
      keyText: m.totalLiabilities,
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'liability.total') ?? '',
      ),
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
      valueText: formatCurrency(
        getValueViaPath<string>(answers, 'equityAndLiabilities.total') ?? '',
      ),
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
