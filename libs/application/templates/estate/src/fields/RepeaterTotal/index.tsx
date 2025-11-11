import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, GridRow, Input } from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../DoubleColumnRow'

interface RepeaterTotalProps {
  id: string
  total: number
  show?: boolean
}

export const RepeaterTotal: FC<RepeaterTotalProps> = ({ id, total, show }) => {
  const { formatMessage } = useLocale()

  if (!show) {
    return null
  }

  return (
    <Box marginTop={5}>
      <GridRow>
        <DoubleColumnRow
          right={
            <Input
              id={`${id}.total`}
              name={`${id}.total`}
              value={formatCurrency(String(isNaN(total) ? 0 : total))}
              label={formatMessage(m.total)}
              backgroundColor="white"
              readOnly
            />
          }
        />
      </GridRow>
    </Box>
  )
}

export default RepeaterTotal
