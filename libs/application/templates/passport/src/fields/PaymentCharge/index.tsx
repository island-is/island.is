import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Service, Services, Passport, YES } from '../../lib/constants'

export const PaymentCharge: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const serviceTypeRegular =
    (application.answers.service as Service).type === Services.REGULAR
  const servicePrice = serviceTypeRegular
    ? formatMessage(m.serviceTypeRegularPrice)
    : formatMessage(m.serviceTypeExpressPrice)
  const servicePriceWithDiscount = serviceTypeRegular
    ? formatMessage(m.serviceTypeRegularPriceWithDiscount)
    : formatMessage(m.serviceTypeExpressPriceWithDiscount)

  const withDiscount =
    ((application.answers.passport as Passport)?.userPassport !== '' &&
      (application.answers.personalInfo as any)?.hasDisabilityDiscount.includes(
        YES,
      )) ||
    (application.answers.passport as Passport)?.childPassport !== ''
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
            <Text>
              {withDiscount ? servicePriceWithDiscount : servicePrice}
            </Text>
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
              {withDiscount ? servicePriceWithDiscount : servicePrice}
            </Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
