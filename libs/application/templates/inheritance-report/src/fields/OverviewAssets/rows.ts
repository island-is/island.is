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

  if (values?.info) {
    items.push({
      title: m.moneyText,
      value: values?.info,
      type: 'info',
    })
  }

  if (hasYes(values.deceasedShareEnabled)) {
    items.push({
      title: m.deceasedShare,
      value: `${String(deceasedShare)}%`,
    })
  }

  return [
    {
      items,
    },
  ]
}

export const getClaimsDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.claims?.data

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const items: RowItemsType = [
      {
        title: m.claimsAmount,
        value: formatCurrency(String(valueToNumber(item.value))),
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

export const getStocksDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.stocks?.data

  const data = (values ?? []).map((item) => {
    // const propertyValuation = roundedValueToNumber(item.amount)

    const items: RowItemsType = [
      {
        title: m.nationalId,
        value: item.nationalId ?? '-',
      },
      {
        title: m.stocksFaceValue,
        value: formatCurrency(String(valueToNumber(item.amount))),
      },
      {
        title: m.stocksRateOfChange,
        value: item.exchangeRateOrInterest,
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
      value: formatCurrency(String(valueToNumber(item.value))),
      items,
    }
  })

  return data
}

export const getBankAccountsDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.bankAccounts?.data

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const isForeign = item.foreignBankAccount?.length

    const items: RowItemsType = [
      // {
      //   title: m.bankAccountCapital,
      //   value: formatCurrency(String(propertyValuation)),
      // },
      {
        title: m.bankAccountPenaltyInterestRates,
        value: formatCurrency(
          String(valueToNumber(item.exchangeRateOrInterest)),
        ),
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

export const getOtherAssetsDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.otherAssets?.data

  const items: RowItemsType = []

  const data = (values ?? []).map((item) => {
    const value = roundedValueToNumber(item.value)

    const deceasedShare = valueToNumber(item.deceasedShare)

    if (hasYes(item.deceasedShareEnabled)) {
      items.push({
        title: m.deceasedShare,
        value: `${String(deceasedShare)}%`,
      })
    }

    return {
      title: item.info,
      value: formatCurrency(String(value)),
      items,
    }
  })

  return data
}

export const getMoneyDataRow = (answers: FormValue): RowType[] => {
  const values = (answers.assets as unknown as EstateAssets)?.money

  const items: RowItemsType = []

  const deceasedShare = valueToNumber(values.deceasedShare)

  if (values?.info) {
    items.push({
      title: m.moneyText,
      value: values?.info,
      type: 'info',
    })
  }

  if (hasYes(values.deceasedShareEnabled)) {
    items.push({
      title: m.deceasedShare,
      value: `${String(deceasedShare)}%`,
    })
  }

  return [
    {
      title: m.totalValue,
      value: formatCurrency(String(values?.value)),
      items,
    },
  ]
}
