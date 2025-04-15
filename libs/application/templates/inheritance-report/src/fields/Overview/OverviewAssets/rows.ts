import { FormValue } from '@island.is/application/types'
import {
  formatBankInfo,
  formatCurrency,
} from '@island.is/application/ui-components'
import { m } from '../../../lib/messages'
import { roundedValueToNumber, valueToNumber } from '../../../lib/utils/helpers'
import {
  BankAccountsData,
  GunsData,
  Inventory,
  Money,
  OtherAssetsData,
  RealEstateData,
  StocksData,
  VehiclesData,
} from '../../../types'
import { RowType, RowItemsType } from './types'
import { format as formatNationalId } from 'kennitala'
import { PREPAID_INHERITANCE } from '../../../lib/constants'
import { getValueViaPath, hasYes } from '@island.is/application/core'

export const getRealEstateDataRow = (answers: FormValue): RowType[] => {
  const realEstateData = getValueViaPath<Array<RealEstateData>>(
    answers,
    'assets.realEstate.data',
  )
  const values = realEstateData?.filter((item) => item.enabled)

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

    const deceasedShare = valueToNumber(item.deceasedShare ?? '0')

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
  const vehiclesData = getValueViaPath<Array<VehiclesData>>(
    answers,
    'assets.vehicles.data',
  )
  const values = vehiclesData?.filter((item) => item.enabled)

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const items: RowItemsType = [
      {
        title: m.vehicleNumberLabel,
        value: item.assetNumber?.toUpperCase() ?? '',
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare ?? '0')

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
  const gunsData = getValueViaPath<Array<GunsData>>(answers, 'assets.guns.data')
  const values = gunsData?.filter((item) => item.enabled)

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const items: RowItemsType = [
      {
        title: m.gunSerialNumber,
        value: item.assetNumber?.toUpperCase() ?? '',
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare ?? '0')

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
  const values = getValueViaPath<Inventory>(answers, 'assets.inventory')

  const items: RowItemsType = []

  const deceasedShare = valueToNumber(values?.deceasedShare ?? '0')

  if (values?.info) {
    items.push({
      title: m.moneyText,
      value: values?.info,
      type: 'info',
    })
  }

  if (hasYes(values?.deceasedShareEnabled)) {
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

export const getStocksDataRow = (answers: FormValue): RowType[] => {
  const stocksData = getValueViaPath<Array<StocksData>>(
    answers,
    'assets.stocks.data',
  )
  const values = stocksData?.filter((item) => item.enabled)

  const data = (values ?? []).map((item) => {
    const items: RowItemsType = [
      {
        title: m.nationalId,
        value: formatNationalId(item.assetNumber ?? '-'),
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

    const deceasedShare = valueToNumber(item.deceasedShare ?? '0')

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
  const bankAccountsData = getValueViaPath<Array<BankAccountsData>>(
    answers,
    'assets.bankAccounts.data',
  )
  const values = bankAccountsData?.filter((item) => item.enabled)

  const data = (values ?? []).map((item) => {
    const propertyValuation = roundedValueToNumber(item.propertyValuation)

    const isForeign = item.foreignBankAccount?.length

    const items: RowItemsType = [
      {
        title: m.bankAccountPenaltyInterestRates,
        value: formatCurrency(
          String(valueToNumber(item.exchangeRateOrInterest)),
        ),
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare ?? '0')

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
  const values = getValueViaPath<Array<OtherAssetsData>>(
    answers,
    'assets.otherAssets.data',
  )

  const data = (values ?? []).map((item) => {
    const value = roundedValueToNumber(item.value)
    const items: RowItemsType = [
      {
        title: item.info,
        value: formatCurrency(String(value)),
      },
    ]

    const deceasedShare = valueToNumber(item.deceasedShare ?? '0')

    if (hasYes(item.deceasedShareEnabled)) {
      items.push({
        title: m.deceasedShare,
        value: `${String(deceasedShare)}%`,
      })
    }

    return {
      value: formatCurrency(String(value)),
      items,
    }
  })

  return data
}

export const getMoneyDataRow = (answers: FormValue): RowType[] => {
  const values = getValueViaPath<Money>(answers, 'assets.money')
  const items: RowItemsType = []
  return [
    {
      title:
        answers.applicationFor === PREPAID_INHERITANCE
          ? m.totalValuePrePaid
          : m.totalValue,
      value: formatCurrency(String(values?.value)),
      items,
    },
  ]
}
