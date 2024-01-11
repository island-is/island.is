import { formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  PaymentChargeOverviewField,
} from '@island.is/application/types'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'

const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

interface Props extends FieldBaseProps {
  field: PaymentChargeOverviewField
}

export const PaymentChargeOverviewFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field }) => {
  const { formatMessage } = useLocale()

  // get list of selected charge items with info
  const selectedChargeList = field.getSelectedChargeItems(application)
  const allChargeWithInfoList = application?.externalData?.payment?.data as [
    {
      priceAmount: number
      chargeItemName: string
      chargeItemCode: string
    },
  ]
  const selectedChargeWithInfoList = selectedChargeList.map((charge) => {
    const chargeWithInfo = allChargeWithInfoList.find(
      (chargeWithInfo) =>
        chargeWithInfo.chargeItemCode === charge.chargeItemCode,
    )
    return { ...chargeWithInfo, extraLabel: charge.extraLabel }
  })

  // calculate total price for all selected charge items
  const totalPrice = selectedChargeWithInfoList.reduce(
    (sum, charge) => sum + (charge?.priceAmount || 0),
    0,
  )

  return (
    <Box>
      <Box>
        <Text variant="h5">
          {formatText(field.forPaymentLabel, application, formatMessage)}
        </Text>
        {selectedChargeWithInfoList.map((charge) => (
          <Box
            paddingTop={1}
            display="flex"
            justifyContent="spaceBetween"
            key={charge?.chargeItemCode}
          >
            <Text>
              {charge?.chargeItemName}
              {charge?.extraLabel
                ? ' - ' +
                  formatText(charge.extraLabel, application, formatMessage)
                : ''}
            </Text>
            <Text>{formatIsk(charge?.priceAmount || 0)}</Text>
          </Box>
        ))}
      </Box>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box paddingBottom={4} display="flex" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatText(field.totalLabel, application, formatMessage)}
        </Text>
        <Text color="blue400" variant="h3">
          {formatIsk(totalPrice)}
        </Text>
      </Box>
    </Box>
  )
}
