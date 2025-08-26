import type { MessageDescriptor } from 'react-intl'
import format from 'date-fns/format'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '@island.is/shared/utils'

import { generic } from '../../messages'

interface PaymentReceiptProps {
  productTitle: string
  amount: number
  paidAt: Date
}

const lines: [MessageDescriptor, keyof PaymentReceiptProps][] = [
  [generic.product, 'productTitle'],
  [generic.amount, 'amount'],
  [generic.paidAt, 'paidAt'],
]

export const PaymentReceipt = (props: PaymentReceiptProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
      {lines.map(([line, key]) => (
        <Box
          key={key}
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          rowGap={[1, 2]}
        >
          <Text fontWeight="semiBold" variant="medium">
            {formatMessage(line)}
          </Text>
          <Text variant="medium" textAlign="left">
            {key === 'amount'
              ? formatCurrency(props[key])
              : key === 'paidAt'
              ? format(new Date(props[key]), 'yyyy-MM-dd HH:mm')
              : props[key]}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
