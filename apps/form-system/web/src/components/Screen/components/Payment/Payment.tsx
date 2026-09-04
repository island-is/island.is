import { useQuery } from '@apollo/client'
import { FormSystemField, PaymentCatalogItem } from '@island.is/api/schema'
import { GET_PAYMENT_CATALOG } from '@island.is/form-system/graphql'
import {
  FieldTypesEnum,
  getValue,
  m,
  SectionTypes,
} from '@island.is/form-system/ui'
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
  const organizationNationalId = state.application.organizationNationalId ?? ''
  const { data } = useQuery(GET_PAYMENT_CATALOG, {
    variables: {
      input: {
        performingOrganizationID: organizationNationalId,
      },
    },
    skip: !organizationNationalId,
    fetchPolicy: 'network-only',
  })
  const isPaymentSection =
    state.sections?.[state.currentSection.index]?.sectionType ===
    SectionTypes.PAYMENT
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

  const paymentCatalogItems = data?.paymentCatalog?.items ?? []

  const getPaymentCatalogItem = (field?: FormSystemField | null) => {
    return paymentCatalogItems.find(
      (item: PaymentCatalogItem) =>
        item.chargeItemCode === field?.fieldSettings?.chargeItemCode,
    )
  }

  const getPriceAmount = (field?: FormSystemField | null) => {
    return Number(getPaymentCatalogItem(field)?.priceAmount ?? 0)
  }

  const getChargeItemName = (field?: FormSystemField | null) => {
    return (
      getPaymentCatalogItem(field)?.chargeItemName ??
      field?.fieldSettings?.chargeItemName ??
      ''
    )
  }

  const getQuantity = (field?: FormSystemField | null) => {
    const quantityField = paymentQuantityFields?.find(
      (f) => f?.id === field?.fieldSettings?.paymentQuantityId,
    )

    return Number(quantityField ? getValue(quantityField, 'number') ?? 1 : 1)
  }

  const total = paymentFields.reduce((sum, field) => {
    const quantity = getQuantity(field)
    const price = getPriceAmount(field)

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
        ? `${quantity} x ${convertToPaymentNumber(getPriceAmount(field))} kr.`
        : `${convertToPaymentNumber(getPriceAmount(field))} kr.`

    return (
      <Box key={index} display="flex" justifyContent="spaceBetween">
        <Text>{getChargeItemName(field)}</Text>
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
        <Text variant="h5">{getChargeItemName(field)}</Text>
        <Inline justifyContent="spaceBetween">
          <Text>{formatMessage(m.price)}</Text>
          <Text>{convertToPaymentNumber(getPriceAmount(field))} kr.</Text>
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
      {!isPaymentSection && <Divider />}
      <Box marginTop={2}>
        <GridRow>
          <GridColumn span="12/12">
            <Box marginTop={2} marginBottom={2}>
              {!isPaymentSection && (
                <Text as="h3" variant="h3" fontWeight="semiBold">
                  {formatMessage(m.payment)}
                </Text>
              )}
            </Box>
            <Stack space={1}>
              <Box marginBottom={2}>
                <Text variant="h4" fontWeight="semiBold">
                  Til greiðslu
                </Text>
              </Box>

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
