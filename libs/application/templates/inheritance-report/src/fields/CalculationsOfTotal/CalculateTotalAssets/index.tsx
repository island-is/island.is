import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { m } from '../../../lib/messages'
import { valueToNumber } from '../../../lib/utils/helpers'

export const CalculateTotalAssets: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { answers } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

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
    getValueViaPath<number>(answers, 'assets.otherAssets.value') || 0,
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

  const [total] = useState(acc)

  useEffect(() => {
    setValue('assets.assetsTotal', total)
  }, [total, setValue])

  return (
    <Box
      display={['block', 'block', 'flex']}
      justifyContent="spaceBetween"
      marginTop={4}
    >
      <Text variant="h3">{formatMessage(m.overviewTotal)}</Text>
      <Text variant="h3">{formatCurrency(String(total))}</Text>
    </Box>
  )
}

export default CalculateTotalAssets
