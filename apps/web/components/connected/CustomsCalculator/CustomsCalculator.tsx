import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'

import {
  Box,
  Button,
  Filter,
  FilterMultiChoice,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  CustomsCalculatorProductCategoriesQuery,
} from '@island.is/web/graphql/schema'
import {
  CALCULATE_CUSTOMS,
  GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES,
  GET_CUSTOMS_CALCULATOR_UNITS,
} from '@island.is/web/screens/queries/CustomsCalculator'

import { translation as translationStrings } from './translation.strings'
import { extractFilterCategories } from './utils'
import * as styles from './CustomsCalculator.css'

interface CustomsCalculatorProps {
  slice: ConnectedComponent
}

interface CalculateMutationResult {
  customsCalculatorCalculate: unknown
}

interface UnitsQueryResult {
  customsCalculatorUnits: unknown
}

interface ProductCategory {
  parentCategory?: string | null
  category?: string | null
  tariffNumber?: string | null
  description?: string | null
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
  const { formatMessage } = useIntl()
  const [tariffNumber, setTariffNumber] = useState(
    (slice?.configJson?.tariffNumber as string) ?? DEFAULT_INPUT.tariffNumber,
  )
  const [referenceDate, setReferenceDate] = useState(
    (slice?.configJson?.referenceDate as string) ?? DEFAULT_INPUT.referenceDate,
  )

  const [getUnits, unitsState] = useLazyQuery<UnitsQueryResult>(
    GET_CUSTOMS_CALCULATOR_UNITS,
  )
  const productCategoriesResponse =
    useQuery<CustomsCalculatorProductCategoriesQuery>(
      GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES,
    )
  const [calculate, calculationState] =
    useMutation<CalculateMutationResult>(CALCULATE_CUSTOMS)

  const filterCategories = useMemo(() => {
    return (
      extractFilterCategories(
        productCategoriesResponse.data?.customsCalculatorProductCategories
          ?.categories ?? [],
      ) ?? []
    )
  }, [productCategoriesResponse.data?.customsCalculatorProductCategories])

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
        <Text variant="h3">{formatMessage(translationStrings.title)}</Text>
        <Text variant="small">
          {formatMessage(translationStrings.description)}
        </Text>

        <Input
          name="tariffNumber"
          label={formatMessage(translationStrings.tariffNumberLabel)}
          value={tariffNumber}
          onChange={(event) => setTariffNumber(event.target.value)}
        />
        <Input
          name="referenceDate"
          label={formatMessage(translationStrings.referenceDateLabel)}
          value={referenceDate}
          onChange={(event) => setReferenceDate(event.target.value)}
        />

        <Box display="flex" columnGap={2}>
          <Button
            size="small"
            onClick={fetchUnits}
            loading={unitsState.loading}
          >
            {formatMessage(translationStrings.fetchUnits)}
          </Button>
          <Button
            size="small"
            variant="ghost"
            onClick={runCalculation}
            loading={calculationState.loading}
          >
            {formatMessage(translationStrings.runCalculation)}
          </Button>
        </Box>

        <Filter
          labelClear={formatMessage(translationStrings.filterClear)}
          labelClearAll={formatMessage(translationStrings.filterClearAll)}
          labelOpen={formatMessage(translationStrings.filterOpen)}
          labelClose={formatMessage(translationStrings.filterClose)}
          labelTitle={formatMessage(translationStrings.filterTitle)}
          labelResult={formatMessage(translationStrings.filterApply)}
          align="left"
          variant="popover"
          reverse
          onFilterClear={() => {
            setTariffNumber('')
          }}
        >
          <Box className={styles.dialog}>
            <FilterMultiChoice
              labelClear={formatMessage(translationStrings.filterClear)}
              categories={filterCategories}
              onChange={(event) => {
                const nextTariffNumber = event.selected[0] ?? ''
                setTariffNumber(nextTariffNumber)
              }}
              onClear={() => {
                setTariffNumber('')
              }}
              singleExpand
            />
          </Box>
        </Filter>

        {Boolean(unitsState.data?.customsCalculatorUnits) && (
          <Box>
            <Text variant="h5" marginBottom={1}>
              {formatMessage(translationStrings.unitsResponse)}
            </Text>
            <pre>
              {JSON.stringify(unitsState.data?.customsCalculatorUnits, null, 2)}
            </pre>
          </Box>
        )}

        {Boolean(calculationState.data?.customsCalculatorCalculate) && (
          <Box>
            <Text variant="h5" marginBottom={1}>
              {formatMessage(translationStrings.calculationResponse)}
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
