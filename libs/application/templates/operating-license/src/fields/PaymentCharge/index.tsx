import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { getChargeItemCode, getCurrencyString } from '../../lib/utils'
import { PaymentCatalogItem } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'

export const PaymentCharge: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const chargeCode = getChargeItemCode(application.answers)
  const chargeItems = getValueViaPath(
    application.externalData,
    'payment.data',
  ) as PaymentCatalogItem[]
  const chargeItem = chargeItems.find(
    (item) => item.chargeItemCode === chargeCode,
  )
  useEffect(() => {
    setValue('chargeItemCode', chargeCode)
  }, [chargeCode, setValue])

  return (
    <Box paddingTop="smallGutter">
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginBottom="gutter">
            <Text variant="h4">{formatMessage(m.applicationPaymentTitle)}</Text>
            <Text marginTop="smallGutter">{chargeItem?.chargeItemName}</Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd" marginBottom="gutter">
            <Text>{getCurrencyString(chargeItem?.priceAmount || 0)}</Text>
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
              {getCurrencyString(chargeItem?.priceAmount || 0)}
            </Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
