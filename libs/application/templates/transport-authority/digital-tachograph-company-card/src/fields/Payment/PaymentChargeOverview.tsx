import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { payment } from '../../lib/messages'
import { formatIsk } from '../../utils'

export const PaymentChargeOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const { externalData } = application
  const item = externalData?.payment?.data as {
    priceAmount: number
    chargeItemName: string
  }
  const price = item?.priceAmount || 0

  return (
    <Box>
      <Box>
        <Text variant="h5">
          {formatMessage(payment.paymentChargeOverview.forPayment)}
        </Text>
        <Box paddingTop={1} display="flex" justifyContent="spaceBetween">
          <Text>{item?.chargeItemName}</Text>
          <Text>{formatIsk(price)}</Text>
        </Box>
      </Box>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box paddingBottom={4} display="flex" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(payment.paymentChargeOverview.total)}
        </Text>
        <Text color="blue400" variant="h3">
          {formatIsk(price)}
        </Text>
      </Box>
    </Box>
  )
}
