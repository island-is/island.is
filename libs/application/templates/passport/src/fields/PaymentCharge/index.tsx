import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Passport,
  PASSPORT_CHARGE_CODES,
  PersonalInfo,
  Service,
  Services,
} from '../../lib/constants'
import { m } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { PaymentCatalogItem } from '@island.is/api/schema'
import { getCurrencyString } from '../../lib/utils'
import { useFormContext } from 'react-hook-form'

export const PaymentCharge: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const serviceTypeRegular =
    (application.answers.service as Service).type === Services.REGULAR

  const withDiscount =
    ((application.answers.passport as Passport)?.userPassport !== '' &&
      (application.answers.personalInfo as PersonalInfo)
        ?.hasDisabilityDiscountChecked) ||
    (application.answers.passport as Passport)?.childPassport !== ''

  const chargeCode = withDiscount
    ? serviceTypeRegular
      ? PASSPORT_CHARGE_CODES.DISCOUNT_REGULAR
      : PASSPORT_CHARGE_CODES.DISCOUNT_EXPRESS
    : serviceTypeRegular
    ? PASSPORT_CHARGE_CODES.REGULAR
    : PASSPORT_CHARGE_CODES.EXPRESS

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
