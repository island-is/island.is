import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useClickAway, useDebounce } from 'react-use'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'

import {
  AsyncSearch,
  Box,
  Button,
  Icon,
  Inline,
  Input,
  Select,
  Stack,
  StringOption,
  Tag,
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

import { ProductCategoryModal } from './ProductCategoryModal'
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

  const currencyOptions = useMemo<StringOption[]>(() => {
    return (
      slice.json?.currencyOptions ?? [
        { label: 'ISK', value: 'ISK', description: 'Íslensk króna' },
        { label: 'AUD', value: 'AUD', description: 'Ástralíudalur' },
        { label: 'CAD', value: 'CAD', description: 'Kanadadalur' },
        { label: 'CHF', value: 'CHF', description: 'Svissneskur franki' },
        { label: 'DKK', value: 'DKK', description: 'Dönsk króna' },
        { label: 'EUR', value: 'EUR', description: 'Evra' },
        { label: 'GBP', value: 'GBP', description: 'Sterlingspund' },
        { label: 'HKD', value: 'HKD', description: 'Hong Kong dalur' },
        { label: 'INR', value: 'INR', description: 'Indversk Rúpía' },
        { label: 'JPY', value: 'JPY', description: 'Japanskt jen' },
        { label: 'NOK', value: 'NOK', description: 'Norsk króna' },
        { label: 'NZD', value: 'NZD', description: 'Ný-Sjálenskur dalur' },
        { label: 'PLN', value: 'PLN', description: 'Pólskt slot' },
        { label: 'SEK', value: 'SEK', description: 'Sænsk króna' },
        { label: 'SGD', value: 'SGD', description: 'Singapúrskur dalur' },
        { label: 'THB', value: 'THB', description: 'Taílenskt bat' },
        { label: 'TWD', value: 'TWD', description: 'Tævanskur dalur' },
        { label: 'USD', value: 'USD', description: 'Bandaríkjadalur' },
      ]
    )
  }, [slice.json?.currencyOptions])

  const [inputState, setInputState] = useState({
    searchInput: '',
    tariffNumber: '',
    currency: currencyOptions?.[0],
    priceWithShipping: '',
  })

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

  useDebounce(
    () => {
      getUnits({
        variables: {
          tariffNumber: inputState.tariffNumber,
          referenceDate: new Date().toISOString(),
        },
      })
    },
    500,
    [inputState.tariffNumber],
  )

  const runCalculation = () => {
    calculate({
      variables: {
        input: {
          ...DEFAULT_INPUT,
          tariffNumber: inputState.tariffNumber,
          referenceDate: new Date().toISOString(),
        },
      },
    })
  }

  const shortcuts = useMemo<{ label: string; value: string }[]>(() => {
    const tariffNumbers = slice.configJson?.tariffNumberShortcuts ?? []
    const shortcuts: { label: string; value: string }[] = []
    for (const tariffNumber of tariffNumbers) {
      const label =
        productCategoriesResponse.data?.customsCalculatorProductCategories?.categories?.find(
          (category) => category.tariffNumber === tariffNumber,
        )?.category
      if (label) shortcuts.push({ label, value: tariffNumber })
    }
    return shortcuts
  }, [
    slice.configJson?.tariffNumberShortcuts,
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.categories,
  ])

  const [isProductCategoryModalVisible, setIsProductCategoryModalVisible] =
    useState(false)

  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  useClickAway(categoryDropdownRef, () =>
    setIsProductCategoryModalVisible(false),
  )

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categoryOptions = useMemo(() => {
    const options = [
      {
        label: 'A',
        value: 'A',
        hasChildren: true,
      },
      {
        label: 'B',
        value: 'B',
        hasChildren: false,
      },
      {
        label: 'C',
        value: 'C',
        hasChildren: true,
      },
    ]

    if (!selectedCategory) return options

    return [
      {
        label: 'D',
        value: 'D',
        hasChildren: true,
      },
      {
        label: 'E',
        value: 'E',
        hasChildren: false,
      },
      {
        label: 'F',
        value: 'F',
        hasChildren: true,
      },
    ]
  }, [selectedCategory])

  return (
    <Stack space={3}>
      {shortcuts.length > 0 && (
        <Stack space={2}>
          <Text variant="h5">
            {formatMessage(translationStrings.shortcutsTitle)}
          </Text>
          <Inline space={1}>
            {shortcuts.map((shortcut) => (
              <Tag
                key={shortcut.value}
                onClick={() =>
                  setInputState({ ...inputState, tariffNumber: shortcut.value })
                }
              >
                {shortcut.label}
              </Tag>
            ))}
          </Inline>
        </Stack>
      )}

      <Stack space={1}>
        <Text variant="h5">
          {formatMessage(translationStrings.productSearchInputLabel)}
        </Text>

        <AsyncSearch
          options={[{ label: 'test', value: 'test' }]}
          size="large"
          placeholder={formatMessage(
            translationStrings.productSearchInputPlaceholder,
          )}
          colored={true}
          inputValue={inputState.searchInput}
          onInputValueChange={(value) =>
            setInputState({ ...inputState, searchInput: value })
          }
          onChange={(option) =>
            setInputState({
              ...inputState,
              tariffNumber: option?.value ?? '',
            })
          }
        />

        {<Text variant="small">{}</Text>}
      </Stack>

      <div ref={categoryDropdownRef} style={{ position: 'relative' }}>
        <Button
          icon="filter"
          size="small"
          variant="utility"
          onClick={() => setIsProductCategoryModalVisible((v) => !v)}
        >
          {formatMessage(translationStrings.searchForCategory)}
        </Button>

        <ProductCategoryModal
          modalTitle={formatMessage(translationStrings.searchForCategory)}
          isVisible={isProductCategoryModalVisible}
          onClose={() => setIsProductCategoryModalVisible(false)}
          onOptionSelect={(option) => {
            setSelectedCategory(option.value)
            if (!option.hasChildren) setIsProductCategoryModalVisible(false)
          }}
          options={categoryOptions}
          topComponent={
            <Box
              background="purple100"
              paddingX={1}
              paddingY={2}
              display="flex"
              justifyContent="flexStart"
              alignItems="center"
              columnGap={1}
              role="button"
              cursor="pointer"
              onClick={() => setSelectedCategory(null)}
            >
              <Icon icon="chevronBack" color="blue400" size="medium" />
              <Text variant="h5">Matvæli</Text>
            </Box>
          }
        />
      </div>

      <Inline space={1}>
        <Box className={styles.currencySelect}>
          <Select
            options={currencyOptions}
            size="sm"
            label={formatMessage(translationStrings.currencyLabel)}
            backgroundColor="blue"
            value={inputState.currency}
            onChange={(option) => {
              if (option) setInputState({ ...inputState, currency: option })
            }}
          />
        </Box>
        <Stack space={1}>
          <Input
            name="asdf"
            size="sm"
            label={formatMessage(translationStrings.priceWithShippingLabel)}
            backgroundColor="blue"
          />
          <Box paddingLeft={1}>
            <Text variant="small">
              {formatMessage(translationStrings.priceWithShippingDescription)}
            </Text>
          </Box>
        </Stack>
      </Inline>

      <Box className={styles.buttonContainer}>
        <Button
          fluid={true}
          onClick={runCalculation}
          loading={calculationState.loading}
        >
          {formatMessage(translationStrings.runCalculation)}
        </Button>
      </Box>

      {/* {Boolean(unitsState.data?.customsCalculatorUnits) && (
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
      )} */}
    </Stack>
  )
}

export default CustomsCalculator
