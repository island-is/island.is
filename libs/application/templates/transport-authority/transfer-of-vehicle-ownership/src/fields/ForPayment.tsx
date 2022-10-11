import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { forPayment } from '../lib/messages'
import { formatIsk } from '../utils'

export const ForPayment: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const price = 1141
  return (
    <Box>
      <Box>
        <Text variant="h5">{formatMessage(forPayment.labels.forPayment)}</Text>
        <Box paddingTop={1} display="flex" justifyContent="spaceBetween">
          <Text>Eigendaskipti</Text>
          <Text>{formatIsk(price)}</Text>
        </Box>
      </Box>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box paddingBottom={4} display="flex" justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(forPayment.labels.total)}</Text>
        <Text color="blue400" variant="h3">
          {formatIsk(price)}
        </Text>
      </Box>
      <AlertMessage
        type="info"
        title={formatMessage(forPayment.labels.alertTitle)}
        message={formatMessage(forPayment.labels.alertMessage)}
      />
    </Box>
  )
}
