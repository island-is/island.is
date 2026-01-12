import { getValueViaPath } from '@island.is/application/core'
import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { format as formatNationalId } from 'kennitala'
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
      valueText: getValueViaPath<string>(answers, 'about.fullName'),
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
      keyText: m.powerOfAttorneyName,
      valueText: getValueViaPath<string>(answers, 'about.powerOfAttorneyName'),
    },
    {
      width: 'half',
      keyText: m.powerOfAttorneyNationalId,
      valueText: formatNationalId(
        getValueViaPath<string>(answers, 'about.powerOfAttorneyNationalId') ??
          '',
      ),
    },
    {
      width: 'half',
      keyText: m.email,
      valueText: getValueViaPath<string>(answers, 'about.email'),
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
      keyText: m.contributionsFromTheTreasury,
      valueText: format(answers, 'partyIncome.contributionsFromTheTreasury'),
    },
    {
      width: 'half',
      keyText: m.parliamentaryPartySupport,
      valueText: format(answers, 'partyIncome.parliamentaryPartySupport'),
    },
    {
      width: 'half',
      keyText: m.municipalContributions,
      valueText: format(answers, 'partyIncome.municipalContributions'),
    },
    {
      width: 'half',
      keyText: m.contributionsFromLegalEntities,
      valueText: format(answers, 'partyIncome.contributionsFromLegalEntities'),
    },
    {
      width: 'half',
      keyText: m.contributionsFromIndividuals,
      valueText: format(answers, 'partyIncome.contributionsFromIndividuals'),
    },
    {
      width: 'half',
      keyText: m.generalMembershipFees,
      valueText: format(answers, 'partyIncome.generalMembershipFees'),
    },
    {
      width: 'half',
      keyText: m.otherIncome,
      valueText: format(answers, 'partyIncome.otherIncome'),
    },
    {
      width: 'full',
      keyText: m.totalIncome,
      valueText: format(answers, 'partyIncome.total'),
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
      valueText: format(answers, 'partyExpense.electionOffice'),
    },
    {
      width: 'half',
      keyText: m.otherCost,
      valueText: format(answers, 'partyExpense.otherCost'),
    },
    {
      width: 'full',
      keyText: m.totalExpenses,
      valueText: format(answers, 'partyExpense.total'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const capitalOverviewItems = (
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

export const propertiesOverviewItems = (
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
      valueText: format(answers, 'equityAndLiabilitiesTotals.assetsTotal'),
      lineAboveKeyText: true,
      boldValueText: true,
    },
  ]
}

export const debtOverviewItems = (
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
      valueText: format(answers, 'equityAndLiabilitiesTotals.liabilitiesTotal'),
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
      width: 'half',
      valueText: format(
        answers,
        'equityAndLiabilitiesTotals.equityAndLiabilitiesTotal',
      ),
    },
  ]
}

export const filesOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  return [
    {
      width: 'full',
      fileName:
        getValueViaPath<string>(answers, 'attachments.file.0.name') ?? '',
      fileType: 'pdf',
    },
  ]
}
