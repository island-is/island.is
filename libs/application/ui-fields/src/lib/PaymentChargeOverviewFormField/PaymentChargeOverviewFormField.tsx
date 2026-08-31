import {
  coreDefaultFieldMessages,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  PaymentChargeOverviewField,
  StaticText,
} from '@island.is/application/types'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import * as styles from './PaymentChargeOverviewFormField.css'

const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

interface Props extends FieldBaseProps {
  field: PaymentChargeOverviewField
}

type PaymentData = {
  priceAmount: number
  chargeItemName: string
  chargeItemCode: string
}

export const PaymentChargeOverviewFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field }) => {
  const { formatMessage } = useLocale()

  // get list of selected charge items with info
  const selectedChargeList = field.getSelectedChargeItems(application)
  // We assume that the payment catalog has the externalID 'payment'
  const allChargeWithInfoList =
    getValueViaPath<PaymentData[]>(application.externalData, 'payment.data') ||
    []
  const selectedChargeWithInfoList = selectedChargeList.map((charge) => {
    const chargeWithInfo = allChargeWithInfoList.find(
      (chargeWithInfo) =>
        chargeWithInfo.chargeItemCode === charge.chargeItemCode,
    )
    return {
      chargeItemCode: charge.chargeItemCode,
      chargeItemName: charge.chargeItemName ?? chargeWithInfo?.chargeItemName,
      priceAmount: charge.chargeItemAmount ?? chargeWithInfo?.priceAmount,
      quantity: charge.chargeItemQuantity,
      extraLabel: charge.extraLabel,
      subLabel: charge.subLabel,
      subAmount: charge.subAmount,
    }
  })

  const subRow = (charge: { subLabel?: StaticText; subAmount?: number }) =>
    charge.subLabel && charge.subAmount !== undefined ? (
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="small">
          {formatText(charge.subLabel, application, formatMessage)}
        </Text>
        <Text variant="small">{formatIsk(charge.subAmount)}</Text>
      </Box>
    ) : null

  // calculate total price for all selected charge items
  const totalPrice = selectedChargeWithInfoList.reduce(
    (sum, charge) => sum + (charge?.priceAmount || 0) * (charge?.quantity || 1),
    0,
  )

  return (
    <Box marginTop={field.marginTop} marginBottom={field.marginBottom}>
      <Box>
        <Text
          variant={field.forPaymentLabelVariant ?? 'h3'}
          className={field.simplifiedList ? styles.fontSize14 : undefined}
          as="h4"
          marginY={2}
        >
          {formatText(field.forPaymentLabel, application, formatMessage)}
        </Text>
        {field.simplifiedList
          ? selectedChargeWithInfoList.map((charge) => (
              <Box key={charge?.chargeItemCode} paddingTop={1}>
                <Box display="flex" justifyContent="spaceBetween">
                  <Text>
                    {charge?.chargeItemName}
                    {charge?.extraLabel
                      ? ` - ${formatMessage(charge.extraLabel)}`
                      : ''}
                  </Text>
                  <Text>
                    {formatIsk(
                      (charge?.priceAmount || 0) * (charge?.quantity || 1),
                    )}
                  </Text>
                </Box>
                {subRow(charge)}
              </Box>
            ))
          : null}
        {field.additionalSummaryLabel && field.getAdditionalSummaryAmount && (
          <Box display="flex" justifyContent="spaceBetween">
            <Text
              variant={field.forPaymentLabelVariant ?? 'h3'}
              className={styles.fontSize14}
              fontWeight="regular"
            >
              {formatMessage(field.additionalSummaryLabel)}
            </Text>
            <Text
              variant={field.forPaymentLabelVariant ?? 'h3'}
              className={styles.fontSize14}
              fontWeight="regular"
            >
              {formatIsk(field.getAdditionalSummaryAmount(application))}
            </Text>
          </Box>
        )}
        {!field.simplifiedList &&
          selectedChargeWithInfoList.map((charge, index) => (
            <Box key={charge?.chargeItemCode}>
              <Text variant="h5">
                {charge?.chargeItemName}
                {charge?.extraLabel
                  ? ` - ${formatMessage(charge.extraLabel)}`
                  : ''}
              </Text>
              <Box paddingTop={1} display="flex" justifyContent="spaceBetween">
                <Text>
                  {field.unitPriceLabel
                    ? formatMessage(field.unitPriceLabel)
                    : formatMessage(
                        coreDefaultFieldMessages.defaultUnitPriceTitle,
                      )}
                </Text>
                <Text> {formatIsk(charge?.priceAmount || 0)}</Text>
              </Box>
              <Box paddingTop={1} display="flex" justifyContent="spaceBetween">
                <Text>
                  {field.quantityLabel
                    ? formatMessage(field.quantityLabel)
                    : formatMessage(
                        coreDefaultFieldMessages.defaultQuantityTitle,
                      )}
                </Text>
                <Text>
                  {charge?.quantity || 1}
                  {field.quantityUnitLabel
                    ? ` ${formatMessage(field.quantityUnitLabel)}`
                    : ''}
                </Text>
              </Box>
              {selectedChargeWithInfoList.length > 1 && (
                <Box
                  paddingTop={1}
                  display="flex"
                  justifyContent="spaceBetween"
                >
                  <Text variant="h5">
                    {field.totalPerUnitLabel
                      ? formatMessage(field.totalPerUnitLabel)
                      : formatMessage(
                          coreDefaultFieldMessages.defaultTotalPerUnitTitle,
                        )}
                  </Text>
                  <Text variant="h5">
                    {' '}
                    {formatIsk(
                      (charge?.priceAmount || 0) * (charge?.quantity || 1),
                    )}
                  </Text>
                </Box>
              )}
              {subRow(charge)}
              {index < selectedChargeWithInfoList.length - 1 && (
                <Box paddingY={3}>
                  <Divider />
                </Box>
              )}
            </Box>
          ))}
      </Box>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box paddingBottom={4} display="flex" justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(field.totalLabel)}</Text>
        <Text color="blue400" variant="h3">
          {formatIsk(totalPrice)}
        </Text>
      </Box>
    </Box>
  )
}
