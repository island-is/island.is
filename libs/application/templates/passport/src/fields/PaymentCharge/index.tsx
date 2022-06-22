import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Service, Services } from '../../lib/constants'

export const PaymentCharge: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const serviceTypeRegular =
    (application.answers.service as Service).type === Services.REGULAR
  const servicePrice = serviceTypeRegular
    ? formatMessage(m.serviceTypeRegularPrice)
    : formatMessage(m.serviceTypeExpressPrice)

  return (
    <Box paddingTop="smallGutter">
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginBottom="gutter">
            <Text variant="h4">
              {formatMessage(m.applicationCompleteTitle)}
            </Text>
            <Text marginTop="smallGutter">
              {formatMessage(m.applicationCompletePassport) +
                ' - ' +
                (serviceTypeRegular
                  ? formatMessage(m.serviceTypeRegular)
                  : formatMessage(m.serviceTypeExpress))}
            </Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd" marginBottom="gutter">
            <Text>{servicePrice}</Text>
          </Box>
        </Column>
      </Columns>
      <Divider />
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginTop="gutter">
            <Text variant="h5">
              {formatMessage(m.applicationCompleteTotal)}
            </Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd">
            <Text variant="h4" color="blue400">
              {servicePrice}
            </Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
