import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { valueToNumber } from './helpers'

export const calculateTotalAssets = (answers: FormValue): number => {
  const moneyTotal = valueToNumber(
    getValueViaPath<number>(answers, 'assets.money.value') || 0,
  )
  const claimsTotal =
    getValueViaPath<number>(answers, 'assets.claims.total') || 0
  const bankAccountsTotal =
    getValueViaPath<number>(answers, 'assets.bankAccounts.total') || 0
  const inventoryTotal = valueToNumber(
    getValueViaPath<number>(answers, 'assets.inventory.value') || 0,
  )
  const vehiclesTotal =
    getValueViaPath<number>(answers, 'assets.vehicles.total') || 0
  const stocksTotal =
    getValueViaPath<number>(answers, 'assets.stocks.total') || 0
  const otherAssetsTotal = valueToNumber(
    getValueViaPath<number>(answers, 'assets.otherAssets.total') || 0,
  )
  const realEstateTotal =
    getValueViaPath<number>(answers, 'assets.realEstate.total') || 0
  const gunsTotal = getValueViaPath<number>(answers, 'assets.guns.total') || 0

  const acc =
    moneyTotal +
    claimsTotal +
    bankAccountsTotal +
    inventoryTotal +
    vehiclesTotal +
    stocksTotal +
    otherAssetsTotal +
    realEstateTotal +
    gunsTotal

  return acc
}
