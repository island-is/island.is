import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Service, Services } from '../../lib/constants'
import { m } from '../../lib/messages'
import { getChargeCode, getPrice } from '../../lib/utils'
import { useFormContext } from 'react-hook-form'

export const PaymentCharge: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const serviceTypeRegular =
    (application.answers.service as Service).type === Services.REGULAR
  const { answers, externalData } = application
  const chargeCode = getChargeCode(answers, externalData)

  const charge = getPrice(externalData, chargeCode)
  useEffect(() => {
    setValue('chargeItemCode', chargeCode)
  }, [chargeCode, setValue])

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
            <Text>{charge}</Text>
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
              {charge}
            </Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
