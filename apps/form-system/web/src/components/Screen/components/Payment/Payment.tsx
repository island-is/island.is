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
  AlertMessage,
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

const paymentCatalogError = {
  title: {
    is: 'Ekki tókst að sækja greiðsluupplýsingar',
    en: 'Could not fetch payment information',
  },
  message: {
    is: 'Villa kom upp við að sækja greiðsluupplýsingar. Vinsamlegast reyndu aftur.',
    en: 'An error occurred while fetching payment information. Please try again.',
  },
}

const paymentCatalogLoadingText = {
  is: 'Sæki greiðsluupplýsingar',
  en: 'Fetching payment information',
}

export const Payment = () => {
  const { formatMessage, lang } = useLocale()
  const { state } = useApplicationContext()
  const organizationNationalId = state.application.organizationNationalId ?? ''
  const { data, loading } = useQuery(GET_PAYMENT_CATALOG, {
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
    const paymentCatalogItem = getPaymentCatalogItem(field)

    return paymentCatalogItem ? Number(paymentCatalogItem.priceAmount) : null
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

    return sum + (price ?? 0) * quantity
  }, 0)

  const renderPrice = (price: number | null) => {
    if (price !== null) {
      return <Text>{convertToPaymentNumber(price)} kr.</Text>
    }

    if (loading) {
      return <Text>{paymentCatalogLoadingText[lang]}</Text>
    }

    return (
      <AlertMessage
        type="error"
        title={paymentCatalogError.title[lang]}
        message={paymentCatalogError.message[lang]}
      />
    )
  }

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
    const price = getPriceAmount(field)
    const priceString =
      price === null
        ? null
        : quantity > 1
        ? `${quantity} x ${convertToPaymentNumber(price)} kr.`
        : `${convertToPaymentNumber(price)} kr.`

    return (
      <Box key={index} display="flex" justifyContent="spaceBetween">
        <Text>{getChargeItemName(field)}</Text>
        {priceString ? <Text>{priceString}</Text> : renderPrice(price)}
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
    const price = getPriceAmount(field)
    return (
      <Stack key={index} space={1}>
        <Text variant="h5">{getChargeItemName(field)}</Text>
        <Inline justifyContent="spaceBetween">
          <Text>{formatMessage(m.price)}</Text>
          {renderPrice(price)}
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
