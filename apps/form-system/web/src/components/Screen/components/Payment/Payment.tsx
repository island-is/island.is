import { getValue, m } from '@island.is/form-system/ui'
import {
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

export const Payment = () => {
  const { formatMessage } = useLocale()
  const { state } = useApplicationContext()
  const { paymentFields, paymentQuantityFields } = state.payment
  console.log('Payment quantity fields:', paymentQuantityFields)

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
            <Stack space={2}>
              <Text variant="h4" fontWeight="semiBold">
                Til greiðslu
              </Text>

              {paymentFields
                ?.filter((field) => field != null && !field.isHidden)
                .map((field, index) => {
                  const paymentQuantityId =
                    field.fieldSettings?.paymentQuantityId
                  const paymentQuantityField = paymentQuantityFields?.find(
                    (f) => f.id === paymentQuantityId,
                  )
                  const quantity = paymentQuantityField
                    ? getValue(paymentQuantityField, 'number')
                    : undefined
                  return (
                    // <Display field={field} key={index} />
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="spaceBetween"
                    >
                      <Text>{field?.fieldSettings?.chargeItemName}</Text>
                      <Text>{`${quantity && quantity} ${
                        field.fieldSettings?.priceAmount
                      } kr.`}</Text>
                    </Box>
                  )
                })}
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  )
}
