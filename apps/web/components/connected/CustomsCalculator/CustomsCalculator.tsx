import { useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ConnectedComponent } from '@island.is/web/graphql/schema'
import {
  CALCULATE_CUSTOMS,
  GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES,
  GET_CUSTOMS_CALCULATOR_UNITS,
} from '@island.is/web/screens/queries/CustomsCalculator'

interface CustomsCalculatorProps {
  slice: ConnectedComponent
}

interface CalculateMutationResult {
  customsCalculatorCalculate: unknown
}

interface UnitsQueryResult {
  customsCalculatorUnits: unknown
}

interface ProductCategoriesQueryResult {
  customsCalculatorProductCategories: unknown
}

const DEFAULT_INPUT = {
  tariffNumber: '85167100',
  customsCode: 'A',
  referenceDate: '2026-02-27T00:00:00Z',
  currencyCode: 'ISK',
  productPrice: '175000',
  plasticPackagingKg: '0',
  cardboardPackagingKg: '0',
  unitCount: '1',
  netWeightKg: '21',
  liters: '0',
  percentage: '0',
  netNetWeightKg: '0',
  sugar: '0',
  sweetener: '0',
  nedcEmission: '-1',
  nedcWeightedEmission: '-1',
  wltpEmission: '-1',
  wltpWeightedEmission: '-1',
  curbWeight: '0',
}

const CustomsCalculator = ({ slice }: CustomsCalculatorProps) => {
  const [tariffNumber, setTariffNumber] = useState(
    (slice?.configJson?.tariffNumber as string) ?? DEFAULT_INPUT.tariffNumber,
  )
  const [referenceDate, setReferenceDate] = useState(
    (slice?.configJson?.referenceDate as string) ?? DEFAULT_INPUT.referenceDate,
  )

  const [getUnits, unitsState] = useLazyQuery<UnitsQueryResult>(
    GET_CUSTOMS_CALCULATOR_UNITS,
  )
  const [getProductCategories, productCategoriesState] =
    useLazyQuery<ProductCategoriesQueryResult>(
      GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES,
    )
  const [calculate, calculationState] = useMutation<CalculateMutationResult>(
    CALCULATE_CUSTOMS,
  )

  const fetchProductCategories = () => {
    getProductCategories()
  }

  const fetchUnits = () => {
    getUnits({
      variables: {
        tariffNumber,
        referenceDate,
      },
    })
  }

  const runCalculation = () => {
    calculate({
      variables: {
        input: {
          ...DEFAULT_INPUT,
          tariffNumber,
          referenceDate,
        },
      },
    })
  }

  return (
    <Box background="blue100" padding={[3, 3, 4]}>
      <Stack space={3}>
        <Text variant="h3">Customs calculator (connected)</Text>
        <Text variant="small">
          Simple test component wired to the customs calculator GraphQL domain.
        </Text>

        <Input
          name="tariffNumber"
          label="Tariff number"
          value={tariffNumber}
          onChange={(event) => setTariffNumber(event.target.value)}
        />
        <Input
          name="referenceDate"
          label="Reference date (ISO)"
          value={referenceDate}
          onChange={(event) => setReferenceDate(event.target.value)}
        />

        <Box display="flex" columnGap={2}>
          <Button
            size="small"
            variant="text"
            onClick={fetchProductCategories}
            loading={productCategoriesState.loading}
          >
            Fetch product categories
          </Button>
          <Button size="small" onClick={fetchUnits} loading={unitsState.loading}>
            Fetch units
          </Button>
          <Button
            size="small"
            variant="ghost"
            onClick={runCalculation}
            loading={calculationState.loading}
          >
            Run calculation
          </Button>
        </Box>

        {(productCategoriesState.error ||
          unitsState.error ||
          calculationState.error) && (
          <AlertMessage
            type="error"
            title="Request failed"
            message={
              productCategoriesState.error?.message ??
              unitsState.error?.message ??
              calculationState.error?.message ??
              'Unknown error'
            }
          />
        )}

        {Boolean(
          productCategoriesState.data?.customsCalculatorProductCategories,
        ) && (
          <Box>
            <Text variant="h5" marginBottom={1}>
              Product categories response
            </Text>
            <pre>
              {JSON.stringify(
                productCategoriesState.data?.customsCalculatorProductCategories,
                null,
                2,
              )}
            </pre>
          </Box>
        )}

        {Boolean(unitsState.data?.customsCalculatorUnits) && (
          <Box>
            <Text variant="h5" marginBottom={1}>
              Units response
            </Text>
            <pre>
              {JSON.stringify(unitsState.data?.customsCalculatorUnits, null, 2)}
            </pre>
          </Box>
        )}

        {Boolean(calculationState.data?.customsCalculatorCalculate) && (
          <Box>
            <Text variant="h5" marginBottom={1}>
              Calculation response
            </Text>
            <pre>
              {JSON.stringify(
                calculationState.data?.customsCalculatorCalculate,
                null,
                2,
              )}
            </pre>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default CustomsCalculator
