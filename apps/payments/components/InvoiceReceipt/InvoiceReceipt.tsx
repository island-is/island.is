import type { MessageDescriptor } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '@island.is/shared/utils'

import { generic } from '../../messages'

interface InvoiceReceiptProps {
  productTitle: string
  amount: number
  payerNationalId: string
  payerName: string
}

const lines: [MessageDescriptor, keyof InvoiceReceiptProps][] = [
  [generic.product, 'productTitle'],
  [generic.amount, 'amount'],
  [generic.nationalId, 'payerNationalId'],
  [generic.name, 'payerName'],
]

export const InvoiceReceipt = (props: InvoiceReceiptProps) => {
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
              : key === 'payerNationalId'
              ? `${props[key].slice(0, 6)}-${props[key].slice(6, 10)}`
              : props[key]}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
