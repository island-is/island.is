import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum, getValue, m } from '@island.is/form-system/ui'
import {
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

export const Payment = () => {
  const { formatMessage } = useLocale()
  const { state } = useApplicationContext()
  const screens = state.sections
    .flatMap((section) => section.screens ?? [])
    .filter(Boolean)

  const paymentFields = screens
    .flatMap((screen) => screen?.fields ?? [])
    .filter(
      (field) => field?.fieldType === FieldTypesEnum.PAYMENT && !field.isHidden,
    )

  const paymentQuantityFields = screens
    .flatMap((screen) => screen?.fields ?? [])
    .filter((field) => field?.fieldType === FieldTypesEnum.PAYMENT_QUANTITY)

  const convertToPaymentNumber = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  const getQuantity = (field?: FormSystemField | null) => {
    const quantityField = paymentQuantityFields?.find(
      (f) => f?.id === field?.fieldSettings?.paymentQuantityId,
    )

    return Number(quantityField ? getValue(quantityField, 'number') ?? 1 : 1)
  }

  const total = paymentFields.reduce((sum, field) => {
    const quantity = getQuantity(field)
    const price = Number(field?.fieldSettings?.priceAmount ?? 0)

    return sum + price * quantity
  }, 0)

  // Keep for demonstration purposes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const QuantityInline = ({
    field,
    index,
  }: {
    field: FormSystemField
    index: number
  }) => {
    const quantity = getQuantity(field)
    const priceString =
      quantity > 1
        ? `${quantity} x ${convertToPaymentNumber(
            Number(field?.fieldSettings?.priceAmount ?? 0),
          )} kr.`
        : `${convertToPaymentNumber(
            Number(field?.fieldSettings?.priceAmount ?? 0),
          )} kr.`

    return (
      <Box key={index} display="flex" justifyContent="spaceBetween">
        <Text>{field?.fieldSettings?.chargeItemName ?? ''}</Text>
        <Text>{priceString}</Text>
      </Box>
    )
  }

  const QuantityStack = ({
    field,
    index,
  }: {
    field: FormSystemField
    index: number
  }) => {
    const quantity = getQuantity(field)
    return (
      <Stack key={index} space={1}>
        <Text variant="h5">{field?.fieldSettings?.chargeItemName ?? ''}</Text>
        <Inline justifyContent="spaceBetween">
          <Text>{formatMessage(m.price)}</Text>
          <Text>
            {convertToPaymentNumber(
              Number(field?.fieldSettings?.priceAmount ?? 0),
            )}{' '}
            kr.
          </Text>
        </Inline>
        <Inline justifyContent="spaceBetween">
          <Text>{formatMessage(m.quantity)}</Text>
          <Text>{quantity}</Text>
        </Inline>
      </Stack>
    )
  }

  return (
    <GridContainer>
      <Divider />
      <Box marginTop={2}>
        <GridRow>
          <GridColumn span="12/12">
            <Box marginTop={2} marginBottom={2}>
              <Text as="h3" variant="h3" fontWeight="semiBold">
                {formatMessage(m.payment)}
              </Text>
            </Box>
            <Stack space={1}>
              <Text variant="h4" fontWeight="semiBold">
                Til greiðslu
              </Text>

              {paymentFields.map((field, index) => {
                if (!field) return null
                return <QuantityStack field={field} index={index} key={index} />
              })}
              <Divider />
              <Box display="flex" justifyContent="spaceBetween">
                <Text variant="h5" fontWeight="semiBold">
                  {formatMessage(m.total)}
                </Text>
                <Text variant="h5" fontWeight="semiBold" color="blue400">
                  {convertToPaymentNumber(total)} kr.
                </Text>
              </Box>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  )
}
