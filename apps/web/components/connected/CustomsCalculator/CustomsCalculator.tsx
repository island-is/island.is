import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

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
import { GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES } from '@island.is/web/screens/queries/CustomsCalculator'

import { ProductCategoryModal } from './ProductCategoryModal'
import { translation as translationStrings } from './translation.strings'
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

  const productCategoriesResponse =
    useQuery<CustomsCalculatorProductCategoriesQuery>(
      GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES,
    )

  const shortcuts = useMemo<{ label: string; value: string }[]>(() => {
    const tariffNumbers = slice.configJson?.tariffNumberShortcuts ?? []
    const shortcuts: { label: string; value: string }[] = []
    for (const tariffNumber of tariffNumbers) {
      const label =
        productCategoriesResponse.data?.customsCalculatorProductCategories?.bottomLevel?.find(
          (category) => category.tariffNumber === tariffNumber,
        )?.label
      if (label) shortcuts.push({ label, value: tariffNumber })
    }
    return shortcuts
  }, [
    slice.configJson?.tariffNumberShortcuts,
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.bottomLevel,
  ])

  const [selectedCategory, setSelectedCategory] = useState({
    current: null as {
      label: string
      value: string
      hasChildren: boolean
    } | null,
    breadcrumbs: [] as { label: string; value: string; hasChildren: true }[],
  })

  const categoryOptions = useMemo(() => {
    const categories =
      productCategoriesResponse.data?.customsCalculatorProductCategories
        ?.topLevel ?? []

    if (selectedCategory.current?.value) {
      const stack = [...categories]
      while (stack.length > 0) {
        const category = stack.pop()
        if (!category) continue
        if (category.id === selectedCategory.current.value)
          return category.children.map((child) => ({
            label: child.label,
            value: child.id,
            hasChildren: child.children.length > 0,
          }))
        stack.push(...category.children)
      }
    }

    return categories.map((category) => ({
      label: category.label,
      value: category.id,
      hasChildren: category.children.length > 0,
    }))
  }, [
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.topLevel,
    selectedCategory,
  ])

  const searchOptions = useMemo(() => {
    const options: { label: string; value: string }[] = []
    for (const category of productCategoriesResponse.data
      ?.customsCalculatorProductCategories?.bottomLevel ?? []) {
      options.push({ label: category.label, value: category.id })
    }
    return options
  }, [
    productCategoriesResponse.data?.customsCalculatorProductCategories
      ?.bottomLevel,
  ])

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
          options={searchOptions}
          filter={(option) =>
            option.label
              .toLowerCase()
              .includes(inputState.searchInput.toLowerCase())
          }
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
        <Text variant="small">{}</Text>
      </Stack>

      <ProductCategoryModal
        title={formatMessage(translationStrings.searchForCategory)}
        onOptionSelect={(option) => {
          setSelectedCategory((prev) => {
            const updatedBreadcrumbs = [...prev.breadcrumbs]
            if (prev.current)
              updatedBreadcrumbs.push({ ...prev.current, hasChildren: true })
            return {
              current: option,
              breadcrumbs: updatedBreadcrumbs,
            }
          })
        }}
        options={categoryOptions}
        topComponent={
          !!selectedCategory.current?.label && (
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
              onClick={() =>
                setSelectedCategory((prev) => {
                  if (prev.breadcrumbs.length > 0)
                    return {
                      current: prev.breadcrumbs[prev.breadcrumbs.length - 1],
                      breadcrumbs: prev.breadcrumbs.slice(0, -1),
                    }
                  return { current: null, breadcrumbs: [] }
                })
              }
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault()
                  setSelectedCategory((prev) => {
                    if (prev.breadcrumbs.length > 0)
                      return {
                        current: prev.breadcrumbs[prev.breadcrumbs.length - 1],
                        breadcrumbs: prev.breadcrumbs.slice(0, -1),
                      }
                    return { current: null, breadcrumbs: [] }
                  })
                }
              }}
            >
              <Icon icon="chevronBack" color="blue400" size="medium" />
              <Text variant="h5">{selectedCategory.current.label}</Text>
            </Box>
          )
        }
      />

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
        <Button fluid={true}>
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
