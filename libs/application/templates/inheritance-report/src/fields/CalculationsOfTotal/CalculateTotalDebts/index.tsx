import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { m } from '../../../lib/messages'

export const CalculateTotalDebts: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { answers } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [total] = useState(
    (getValueViaPath<number>(answers, 'debts.domesticAndForeignDebts.total') ||
      0) + (getValueViaPath<number>(answers, 'debts.publicCharges.total') || 0),
  )

  useEffect(() => {
    setValue('debts.debtsTotal', total)
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

export default CalculateTotalDebts
