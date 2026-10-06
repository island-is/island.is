import { type ReactNode, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Control, Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Select,
  SkeletonLoader,
  Stack,
  StringOption,
  Text,
} from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'
import { InputController } from '@island.is/shared/form-fields'
import {
  formatCurrency,
  formatCurrencyWithoutSuffix,
} from '@island.is/shared/utils'
import type {
  CustomsCalculatorCalculateQuery,
  CustomsGeneralChargesQuery,
} from '@island.is/web/graphql/schema'
import { GET_CUSTOMS_CALCULATOR_CALCULATE } from '@island.is/web/screens/queries/CustomsCalculator'
import { GET_CUSTOMS_GENERAL_CHARGES } from '@island.is/web/screens/queries/CustomsGeneral'

import { translation as translationStrings } from './translation.strings'
import * as styles from './Units.css'

const CURRENCY_COLUMN_SPAN: SpanType = ['12/12', '4/12', '4/12', '4/12', '3/12']
const UNIT_COLUMN_SPAN: SpanType = ['12/12', '6/12']

const PRODUCT_INFO_UNITS = ['STK', 'NET', 'LIT', 'PRO', 'UT*']

// Combines the descriptions into a single sentence, e.g. "Skráið
// áfengisprósentu" and "Skráið heildarmagn í lítrum" become "Skráið
// áfengisprósentu og heildarmagn í lítrum."
const combineDescriptions = (descriptions: string[], conjunction: string) => {
  const [first, ...rest] = descriptions.map((description) =>
    description.trim().replace(/\.$/, ''),
  )
  if (!first) return ''
  const leadingWord = first.split(' ')[0]
  const parts = [
    first,
    ...rest.map((description) =>
      description.startsWith(`${leadingWord} `)
        ? description.slice(leadingWord.length + 1)
        : description,
    ),
  ]
  const last = parts.pop()
  return `${parts.length > 0 ? `${parts.join(', ')} ${conjunction} ` : ''}${last}.`
}

interface UnitInputProps {
  name: string
  label: string
  inputMode?: 'decimal' | 'numeric'
  // Render as a decimal field that accepts a comma decimal separator (e.g. the
  // alcohol strength percentage). Unlike currency mode this treats the bound
  // value as a numeric string, so a typed "5,5" round-trips correctly instead
  // of the stored "5.5" being re-read as "55".
  allowDecimal?: boolean
  control: Control<UnitsFormValues>
}

export const UnitInput = ({
  name,
  label,
  inputMode,
  allowDecimal,
  control,
}: UnitInputProps) => {
  return (
    <InputController
      id={name}
      name={name}
      label={label}
      size="sm"
      backgroundColor="white"
      type="number"
      inputMode={allowDecimal ? 'decimal' : inputMode}
      currency={!allowDecimal}
      thousandSeparator={allowDecimal ? true : undefined}
      decimalScale={allowDecimal ? 2 : undefined}
      suffix=""
      control={control}
      allowNegative={false}
    />
  )
}

const BREAKDOWN_COLUMN_SPANS: [SpanType, SpanType, SpanType] = [
  '5/12',
  '4/12',
  '3/12',
]

interface BreakdownRowProps {
  columns: [string, string, string]
  heading?: boolean
  fontWeight?: 'light' | 'regular'
}

const BreakdownRow = ({ columns, heading, fontWeight }: BreakdownRowProps) => (
  <GridRow alignItems="center">
    {columns.map((column, index) => (
      <GridColumn key={index} span={BREAKDOWN_COLUMN_SPANS[index]}>
        <Box textAlign={index === columns.length - 1 ? 'right' : 'left'}>
          <Text variant={heading ? 'h5' : 'default'} fontWeight={fontWeight}>
            {column}
          </Text>
        </Box>
      </GridColumn>
    ))}
  </GridRow>
)

interface UnitsProps {
  unitStrings: string[]
  currencyOptions: StringOption[]
  tariffNumber: string
  allowCalculation: boolean
  // Element the calculation results are rendered into, so they can be placed
  // outside of the calculator box
  resultsContainer?: HTMLElement | null
}

interface UnitsFormValues {
  net: string
  unitCount: string
  liters: string
  percentage: string
  nedc: string
  nedcWeighted: string
  wltp: string
  wltpWeighted: string
  currency?: StringOption
  priceWithShipping: string
}

export const Units = ({
  unitStrings,
  currencyOptions,
  tariffNumber,
  allowCalculation,
  resultsContainer,
}: UnitsProps) => {
  const { formatMessage } = useIntl()

  const { control, getValues } = useForm<UnitsFormValues>({
    defaultValues: {
      net: '',
      unitCount: '1',
      liters: '',
      percentage: '',
      nedc: '',
      nedcWeighted: '',
      wltp: '',
      wltpWeighted: '',
      currency: currencyOptions?.[0],
      priceWithShipping: '',
    },
  })

  const [calculate, { data, loading, called, error }] =
    useLazyQuery<CustomsCalculatorCalculateQuery>(
      GET_CUSTOMS_CALCULATOR_CALCULATE,
    )

  // Charge names (e.g. "Verðtollur") are shown as the explanation of each
  // charge in the breakdown, they come from the same endpoint as the customs
  // charges list
  const [chargesDate] = useState(
    () => `${new Date().toISOString().split('.')[0]}Z`,
  )
  const chargesResponse = useQuery<CustomsGeneralChargesQuery>(
    GET_CUSTOMS_GENERAL_CHARGES,
    {
      variables: { input: { date: chargesDate, system: 'I' } },
      skip: !called,
    },
  )
  const chargeNameByCode = useMemo(() => {
    const chargeNameByCode = new Map<string, string>()
    for (const charge of chargesResponse.data?.customsGeneralCharges ?? []) {
      if (charge.code && charge.name)
        chargeNameByCode.set(charge.code, charge.name)
    }
    return chargeNameByCode
  }, [chargesResponse.data?.customsGeneralCharges])

  const hasProductInfoInputs = PRODUCT_INFO_UNITS.some((unit) =>
    unitStrings.includes(unit),
  )

  const productInfoDescription = combineDescriptions(
    [
      unitStrings.includes('UT*') &&
        formatMessage(translationStrings.nedcDescription),
      unitStrings.includes('UT*') &&
        formatMessage(translationStrings.nedcWeightedEmissionDescription),
      unitStrings.includes('UT*') &&
        formatMessage(translationStrings.wltpEmissionDescription),
      unitStrings.includes('UT*') &&
        formatMessage(translationStrings.wltpWeightedEmissionDescription),
      unitStrings.includes('PRO') &&
        formatMessage(translationStrings.percentageDescription),
      unitStrings.includes('LIT') &&
        formatMessage(translationStrings.litersDescription),
      unitStrings.includes('NET') &&
        formatMessage(translationStrings.netWeightDescription),
      unitStrings.includes('STK') &&
        formatMessage(translationStrings.unitCountDescription),
    ].filter((description): description is string =>
      Boolean(typeof description === 'string' && description.trim()),
    ),
    formatMessage(translationStrings.descriptionConjunction),
  )

  const breakdownRef = useRef<HTMLDivElement>(null)

  // The price and currency the last calculation was run with
  const [submittedPrice, setSubmittedPrice] = useState<{
    currency: string
    amount: string
  } | null>(null)

  const results = (
    <Box ref={breakdownRef} paddingTop={resultsContainer && called ? 8 : 0}>
      {called && loading && <SkeletonLoader height={480} />}
      {!loading && error && (
        <AlertMessage
          type="error"
          title={formatMessage(translationStrings.calculationErrorTitle)}
          message={formatMessage(translationStrings.calculationErrorMessage)}
        />
      )}
      {data?.customsCalculatorCalculate?.hasUnparseableCharge &&
        !loading &&
        !error && (
          <Box marginBottom={2}>
            <AlertMessage
              type="warning"
              title={formatMessage(translationStrings.incompleteResultTitle)}
              message={formatMessage(
                translationStrings.incompleteResultMessage,
              )}
            />
          </Box>
        )}
      {data?.customsCalculatorCalculate && !loading && !error && (
        <Stack space={8}>
          <Box background="purple100" borderRadius="large" padding={[3, 3, 6]}>
            <Stack space={3}>
              <Stack space={1}>
                <Text variant="h5">
                  {formatMessage(translationStrings.importFeesLabel)}
                </Text>
                <Text variant="h2">
                  {formatCurrency(
                    Number(data.customsCalculatorCalculate.additionalAmount),
                  )}
                </Text>
              </Stack>
              <Divider thickness="thick" weight="purple300" />
              <Stack space={2}>
                <BreakdownRow
                  heading={true}
                  columns={[
                    formatMessage(translationStrings.breakdownLabel),
                    formatMessage(translationStrings.explanationLabel),
                    formatMessage(translationStrings.amountLabel),
                  ]}
                />
                <Stack space={1}>
                  {data.customsCalculatorCalculate.charges?.map(
                    (charge, index) => (
                      <BreakdownRow
                        key={`${charge.code}-${index}`}
                        columns={[
                          charge.code
                            ? `${charge.description ?? ''} (${charge.code})`
                            : (charge.description ?? ''),
                          chargeNameByCode.get(charge.code ?? '') ?? '',
                          formatCurrencyWithoutSuffix(Number(charge.amount)),
                        ]}
                      />
                    ),
                  )}
                </Stack>
              </Stack>
              <Divider thickness="thick" weight="purple300" />
              <BreakdownRow
                columns={[
                  formatMessage(translationStrings.startAmountLabel),
                  submittedPrice
                    ? `${submittedPrice.currency} ${formatCurrencyWithoutSuffix(
                        submittedPrice.amount,
                      )}`
                    : '',
                  formatCurrencyWithoutSuffix(
                    Number(data.customsCalculatorCalculate.startAmount),
                  ),
                ]}
              />
              <Divider weight="purple300" />
              <BreakdownRow
                fontWeight="regular"
                columns={[
                  formatMessage(translationStrings.totalAmountLabel),
                  '',
                  formatCurrencyWithoutSuffix(
                    Number(data.customsCalculatorCalculate.totalAmount),
                  ),
                ]}
              />
            </Stack>
          </Box>
          <Stack space={2}>
            <Text>{formatMessage(translationStrings.disclaimer)}</Text>
            <Text>
              {formatMessage(translationStrings.exchangeRateDisclaimer, {
                link: (chunks: ReactNode) => (
                  <a
                    className={styles.link}
                    href={formatMessage(
                      translationStrings.exchangeRateDisclaimerLinkUrl,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </Text>
          </Stack>
        </Stack>
      )}
    </Box>
  )

  const form = (
    <Stack space={6}>
      <Stack space={1}>
        <Text variant="h5">
          {formatMessage(translationStrings.priceSectionTitle)}
        </Text>
        <Stack space={3}>
          <Text>
            {formatMessage(translationStrings.priceWithShippingDescription)}
          </Text>
          <GridRow rowGap={3}>
            <GridColumn span={CURRENCY_COLUMN_SPAN}>
              <Controller
                name="currency"
                control={control}
                render={({ field: { onChange } }) => (
                  <Select
                    options={currencyOptions}
                    size="sm"
                    label={formatMessage(translationStrings.currencyLabel)}
                    backgroundColor="white"
                    onChange={(option) => {
                      if (option) onChange(option)
                    }}
                    defaultValue={currencyOptions?.[0]}
                  />
                )}
              />
            </GridColumn>
            <GridColumn span={UNIT_COLUMN_SPAN}>
              <UnitInput
                name="priceWithShipping"
                label={formatMessage(translationStrings.priceWithShippingLabel)}
                control={control}
              />
            </GridColumn>
          </GridRow>
        </Stack>
      </Stack>

      {hasProductInfoInputs && (
        <Stack space={3}>
          <Stack space={1}>
            <Text variant="h5">
              {formatMessage(translationStrings.productInfoSectionTitle)}
            </Text>
            {!!productInfoDescription && <Text>{productInfoDescription}</Text>}
          </Stack>
          <GridRow rowGap={3}>
            {unitStrings.includes('STK') && (
              <GridColumn span={UNIT_COLUMN_SPAN}>
                <UnitInput
                  name="unitCount"
                  label={formatMessage(translationStrings.unitCountLabel)}
                  control={control}
                />
              </GridColumn>
            )}
            {unitStrings.includes('NET') && (
              <GridColumn span={UNIT_COLUMN_SPAN}>
                <UnitInput
                  name="net"
                  label={formatMessage(translationStrings.netWeightLabel)}
                  control={control}
                />
              </GridColumn>
            )}
            {unitStrings.includes('LIT') && (
              <GridColumn span={UNIT_COLUMN_SPAN}>
                <UnitInput
                  name="liters"
                  label={formatMessage(translationStrings.litersLabel)}
                  control={control}
                />
              </GridColumn>
            )}
            {unitStrings.includes('PRO') && (
              <GridColumn span={UNIT_COLUMN_SPAN}>
                <UnitInput
                  name="percentage"
                  label={formatMessage(translationStrings.percentageLabel)}
                  control={control}
                  allowDecimal={true}
                />
              </GridColumn>
            )}
            {unitStrings.includes('UT*') && (
              <>
                <GridColumn span={UNIT_COLUMN_SPAN}>
                  <UnitInput
                    name="nedc"
                    label={formatMessage(translationStrings.nedcEmissionLabel)}
                    control={control}
                  />
                </GridColumn>
                <GridColumn span={UNIT_COLUMN_SPAN}>
                  <UnitInput
                    name="nedcWeighted"
                    label={formatMessage(
                      translationStrings.nedcWeightedEmissionLabel,
                    )}
                    control={control}
                  />
                </GridColumn>
                <GridColumn span={UNIT_COLUMN_SPAN}>
                  <UnitInput
                    name="wltp"
                    label={formatMessage(translationStrings.wltpEmissionLabel)}
                    control={control}
                  />
                </GridColumn>
                <GridColumn span={UNIT_COLUMN_SPAN}>
                  <UnitInput
                    name="wltpWeighted"
                    label={formatMessage(
                      translationStrings.wltpWeightedEmissionLabel,
                    )}
                    control={control}
                  />
                </GridColumn>
              </>
            )}
          </GridRow>
        </Stack>
      )}

      <Box className={styles.buttonContainer}>
        <Button
          fluid={true}
          disabled={!allowCalculation}
          loading={loading}
          onClick={() => {
            const values = getValues()
            setSubmittedPrice(
              values.priceWithShipping && values.currency?.value
                ? {
                    currency: values.currency.value,
                    amount: values.priceWithShipping,
                  }
                : null,
            )
            calculate({
              variables: {
                input: {
                  tariffNumber,
                  currencyCode: values.currency?.value,
                  priceWithShipping: values.priceWithShipping,
                  unitCount: values.unitCount,
                  netWeightKg: values.net,
                  liters: values.liters,
                  percentage: values.percentage,
                  nedcEmission: values.nedc,
                  nedcWeightedEmission: values.nedcWeighted,
                  wltpEmission: values.wltp,
                  wltpWeightedEmission: values.wltpWeighted,
                },
              },
            })
            if (breakdownRef.current) {
              const top =
                breakdownRef.current.getBoundingClientRect().top +
                window.scrollY -
                80
              window.scrollTo({ top, behavior: 'smooth' })
            }
          }}
        >
          {formatMessage(translationStrings.runCalculation)}
        </Button>
      </Box>

      {!resultsContainer && results}
    </Stack>
  )

  return resultsContainer ? (
    <>
      {form}
      {createPortal(results, resultsContainer)}
    </>
  ) : (
    form
  )
}
