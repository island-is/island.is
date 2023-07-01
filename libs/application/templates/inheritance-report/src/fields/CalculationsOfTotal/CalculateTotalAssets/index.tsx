import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { m } from '../../../lib/messages'

export const CalculateTotalAssets: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { answers } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [total] = useState(
    (getValueViaPath<number>(answers, 'assets.otherAssets.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.money.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.stocks.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.claims.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.bankAccounts.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.inventory.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.vehicles.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.realEstate.total') || 0) +
      (getValueViaPath<number>(answers, 'assets.guns.total') || 0),
  )

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
