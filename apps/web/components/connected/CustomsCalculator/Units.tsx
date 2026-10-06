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

// Formats an amount with "." as the thousand separator and "," as the decimal
// separator, e.g. "1234.5" becomes "1.234,5"
const formatAmount = (value: number | string) => {
  const [integerPart, decimalPart] = String(value).split('.')
  const formattedIntegerPart = formatCurrencyWithoutSuffix(integerPart)
  return decimalPart
    ? `${formattedIntegerPart},${decimalPart}`
    : formattedIntegerPart
}

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
  return `${
    parts.length > 0 ? `${parts.join(', ')} ${conjunction} ` : ''
  }${last}.`
}

interface UnitInputProps {
  name: string
  label: string
  // Maximum number of decimals, where 0 only allows whole numbers and shows a
  // digits only keyboard on mobile devices
  decimalScale?: number
  control: Control<UnitsFormValues>
}

// The value is stored as a numeric string (e.g. "0.75") and shown with a
// comma decimal separator and dot thousand separators (e.g. "0,75"). The
// currency mode of InputController isn't used since it re-reads the stored
// "0.75" as "075", which drops the decimal separator while typing.
export const UnitInput = ({
  name,
  label,
  decimalScale = 3,
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
      inputMode={decimalScale > 0 ? 'decimal' : 'numeric'}
      thousandSeparator={true}
      decimalScale={decimalScale}
      suffix=""
      control={control}
      allowNegative={false}
    />
  )
}

// Below the xl breakpoint there isn't room for three columns, so each row
// shows the label and amount side by side with the explanation underneath
const BREAKDOWN_LABEL_SPAN: SpanType = ['8/12', '8/12', '8/12', '8/12', '5/12']
const BREAKDOWN_EXPLANATION_SPAN: SpanType = [
  '12/12',
  '12/12',
  '12/12',
  '12/12',
  '4/12',
]
const BREAKDOWN_AMOUNT_SPAN: SpanType = ['4/12', '4/12', '4/12', '4/12', '3/12']

interface BreakdownRowProps {
  label: string
  explanation: string
  amount: string
  heading?: boolean
}

const BreakdownRow = ({
  label,
  explanation,
  amount,
  heading,
}: BreakdownRowProps) => (
  <GridRow alignItems="center">
    <GridColumn span={BREAKDOWN_LABEL_SPAN}>
      <Text variant={heading ? 'h5' : 'default'}>{label}</Text>
    </GridColumn>
    <GridColumn
      span={BREAKDOWN_EXPLANATION_SPAN}
      order={[3, 3, 3, 3, 2]}
      // The explanation column title is only needed in the three column layout
      hiddenBelow={heading ? 'xl' : undefined}
    >
      <Text variant={heading ? 'h5' : 'small'}>{explanation}</Text>
    </GridColumn>
    <GridColumn span={BREAKDOWN_AMOUNT_SPAN} order={[2, 2, 2, 2, 3]}>
      <Box textAlign="right">
        <Text variant={heading ? 'h5' : 'default'}>{amount}</Text>
      </Box>
    </GridColumn>
  </GridRow>
)

interface UnitsProps {
  unitStrings: string[]
  currencyOptions: StringOption[]
  tariffNumber: string
  allowCalculation: boolean
  // Element the calculation results are rendered into, so they can be placed
  // outside of the calculator box
  resultsContainer: HTMLElement | null
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
  // Rounded to the start of the day so the response is cached between products
  const [chargesDate] = useState(
    () => `${new Date().toISOString().split('T')[0]}T00:00:00Z`,
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
    <Box ref={breakdownRef} paddingTop={called ? 8 : 0}>
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
          <Box
            background="purple100"
            borderRadius="large"
            padding={[3, 3, 4, 6]}
          >
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
              <GridRow alignItems="center">
                <GridColumn span={['6/12', '6/12', '6/12', '6/12', '5/12']}>
                  <Text variant="h5">
                    {formatMessage(translationStrings.totalAmountLabel)}
                  </Text>
                </GridColumn>
                <GridColumn span={['6/12', '6/12', '6/12', '6/12', '7/12']}>
                  <Box textAlign={['right', 'right', 'right', 'right', 'left']}>
                    <Text variant="h5">
                      {formatCurrency(
                        Number(data.customsCalculatorCalculate.totalAmount),
                      )}
                    </Text>
                  </Box>
                </GridColumn>
              </GridRow>
              <Divider thickness="thick" weight="purple300" />
              <Stack space={2}>
                <BreakdownRow
                  heading={true}
                  label={formatMessage(translationStrings.breakdownLabel)}
                  explanation={formatMessage(
                    translationStrings.explanationLabel,
                  )}
                  amount={formatMessage(translationStrings.amountLabel)}
                />
                <Stack space={[2, 2, 2, 2, 1]}>
                  <BreakdownRow
                    label={formatMessage(translationStrings.startAmountLabel)}
                    explanation={
                      submittedPrice
                        ? `${submittedPrice.currency} ${formatAmount(
                            submittedPrice.amount,
                          )}`
                        : ''
                    }
                    amount={formatAmount(
                      Number(data.customsCalculatorCalculate.startAmount),
                    )}
                  />
                  {data.customsCalculatorCalculate.charges?.map(
                    (charge, index) => (
                      <BreakdownRow
                        key={`${charge.code}-${index}`}
                        label={
                          charge.code
                            ? `${charge.description ?? ''} (${charge.code})`
                            : charge.description ?? ''
                        }
                        explanation={
                          chargeNameByCode.get(charge.code ?? '') ?? ''
                        }
                        amount={formatAmount(Number(charge.amount))}
                      />
                    ),
                  )}
                </Stack>
              </Stack>
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
                decimalScale={0}
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
                  decimalScale={0}
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
                  decimalScale={2}
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
    </Stack>
  )

  return (
    <>
      {form}
      {resultsContainer && createPortal(results, resultsContainer)}
    </>
  )
}
