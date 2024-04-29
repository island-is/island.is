import { FormValue } from '@island.is/application/types'
import {
  formatBankInfo,
  formatCurrency,
} from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import {
  roundedValueToNumber,
  valueToNumber,
  hasYes,
} from '../../lib/utils/helpers'
import { EstateAssets } from '../../types'
import { RowType, RowItemsType } from './types'

export const getRealEstateDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.realEstate?.data

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)
    const propertyShare = valueToNumber(item.share)

    const items: RowItemsType = [
      {
        title: m.assetNumber,
        value: item.assetNumber,
      },
      {
        title: m.propertyShare,
        value: `${propertyShare}%`,
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare)

    if (hasYes(item.deceasedShareEnabled)) {
      items.push({
        title: m.deceasedShare,
        value: `${String(deceasedShare)}%`,
      })
    }

    return {
      title: item.description,
      value: formatCurrency(String(propertyValuation)),
      items,
    }
  })

  return data
}

export const getVehiclesDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.vehicles?.data

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const items: RowItemsType = [
      {
        title: m.vehicleNumberLabel,
        value: item.assetNumber?.toUpperCase() ?? '',
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare)

    if (hasYes(item.deceasedShareEnabled)) {
      items.push({
        title: m.deceasedShare,
        value: `${String(deceasedShare)}%`,
      })
    }

    return {
      title: item.description,
      value: formatCurrency(String(propertyValuation)),
      items,
    }
  })

  return data
}

export const getGunsDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.guns?.data

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const items: RowItemsType = [
      {
        title: m.gunNumber,
        value: item.assetNumber?.toUpperCase() ?? '',
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare)

    if (hasYes(item.deceasedShareEnabled)) {
      items.push({
        title: m.deceasedShare,
        value: `${String(deceasedShare)}%`,
      })
    }

    return {
      title: item.description,
      value: formatCurrency(String(propertyValuation)),
      items,
    }
  })

  return data
}

export const getInventoryDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.inventory

  const items: RowItemsType = []

  const deceasedShare = valueToNumber(values.deceasedShare)

  if (hasYes(values.deceasedShareEnabled)) {
    items.push({
      title: m.deceasedShare,
      value: `${String(deceasedShare)}%`,
    })
  }

  return [
    {
      title: m.inventoryTextField,
      value: values?.info,
      items,
    },
  ]
}

// const isForeign = account.foreignBankAccount?.length

// const description = [
//   `${m.bankAccountCapital.defaultMessage}: ${formatCurrency(
//     String(valueToNumber(account.propertyValuation)),
//   )}`,
//   `${
//     m.bankAccountPenaltyInterestRates.defaultMessage
//   }: ${formatCurrency(
//     String(valueToNumber(account.exchangeRateOrInterest)),
//   )}`,
//   `${m.bankAccountForeign.defaultMessage}: ${
//     isForeign ? m.yes.defaultMessage : m.no.defaultMessage
//   }`,
// ]

// const deceasedShare = valueToNumber(account.deceasedShare)

// if (hasYes(account.deceasedShareEnabled)) {
//   description.push(
//     m.deceasedShare.defaultMessage + `: ${String(deceasedShare)}%`,
//   )
// }

// return {
//   titleRequired: false,
//   title: isForeign
//     ? account.assetNumber
//     : formatBankInfo(account.assetNumber ?? ''),
//   description,
// }
// }),

export const getBankAccountsDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.bankAccounts?.data

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const isForeign = item.foreignBankAccount?.length

    const items: RowItemsType = [
      {
        title: m.estateBankInfo,
        value: item.assetNumber?.toUpperCase() ?? '',
      },
      {
        title: m.bankAccountCapital,
        value: formatCurrency(String(propertyValuation)),
      },
      {
        title: m.bankAccountPenaltyInterestRates,
        value: String(valueToNumber(item.exchangeRateOrInterest)),
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare)

    if (hasYes(item.deceasedShareEnabled)) {
      items.push({
        title: m.deceasedShare,
        value: `${String(deceasedShare)}%`,
      })
    }

    return {
      title: isForeign
        ? item.assetNumber
        : formatBankInfo(item.assetNumber ?? ''),
      value: formatCurrency(String(propertyValuation)),
      items,
    }
  })

  return data
}
