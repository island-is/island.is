import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'

export const CalculateTotalAssets: FC<FieldBaseProps> = ({ application }) => {
  const { answers } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [total] = useState(
    (getValueViaPath(answers, 'assets.otherAssets.total') as number) +
      (getValueViaPath(answers, 'assets.money.total') as number) +
      (getValueViaPath(answers, 'assets.stocks.total') as number) +
      (getValueViaPath(answers, 'assets.claims.total') as number) +
      (getValueViaPath(answers, 'assets.bankAccounts.total') as number) +
      (getValueViaPath(answers, 'assets.inventory.total') as number) +
      (getValueViaPath(answers, 'assets.vehicles.total') as number) +
      (getValueViaPath(answers, 'assets.realEstate.total') as number),
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
