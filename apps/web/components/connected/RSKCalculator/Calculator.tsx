import { Controller, useForm } from 'react-hook-form'
import { MessageDescriptor, useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridColumnProps,
  GridRow,
  Option,
  RadioButton,
  Select,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  ConnectedComponent,
  GetRskCalculatorCalculationQuery,
  GetRskCalculatorCalculationQueryVariables,
  GetRskCalculatorFieldsQuery,
  GetRskCalculatorFieldsQueryVariables,
  RskCalculatorField,
  RskCalculatorFieldKind,
  RskCalculatorResultRow,
  RskCalculatorType,
} from '@island.is/web/graphql/schema'
import {
  GET_RSK_CALCULATOR_CALCULATION,
  GET_RSK_CALCULATOR_FIELDS,
} from '@island.is/web/screens/queries/RSKCalculator'
import { formatCurrency } from '@island.is/web/utils/currency'

import { messages } from './messages'

// The Contentful `configJson.calculatorType` value is locale-independent and
// selects which calculator this slice instance calls. It is intentionally
// English/camelCase and does not need to match the GraphQL enum's wire value.
const CALCULATOR_TYPE_BY_CONFIG_VALUE: Record<string, RskCalculatorType> = {
  withholdingTaxOnWages: RskCalculatorType.WithholdingTaxOnWages,
  childBenefit: RskCalculatorType.ChildBenefit,
}

const getCalculatorType = (value: unknown): RskCalculatorType | undefined => {
  if (typeof value !== 'string') return undefined
  return CALCULATOR_TYPE_BY_CONFIG_VALUE[value]
}

// Fields not listed here (maritalStatus, paymentFrequency, payMonth) are
// intentionally omitted from the withholdingTaxOnWages layout -- they are
// still submitted with the calculation via `fields`, just never rendered.
// Spans stack to full width below `lg` so the form never renders more than
// one column on mobile/tablet, matching the Figma "2 col + 0 / 3 col + 2
// gutter" desktop grid without producing a wall of tiny columns on mobile.
const HALF_ROW_SPAN: NonNullable<GridColumnProps['span']> = [
  '1/1',
  '1/1',
  '1/1',
  '6/12',
]
const THIRD_ROW_SPAN: NonNullable<GridColumnProps['span']> = [
  '1/1',
  '1/1',
  '6/12',
  '4/12',
]

interface CalculatorSectionField {
  key: string
  span: NonNullable<GridColumnProps['span']>
}

interface CalculatorFieldSection {
  titleMessage: MessageDescriptor
  descriptionMessage?: MessageDescriptor
  fields: CalculatorSectionField[]
}

const WITHHOLDING_TAX_ON_WAGES_SECTIONS: CalculatorFieldSection[] = [
  {
    titleMessage: messages.sectionPaymentsTitle,
    fields: [
      { key: 'salary', span: ['1/1', '1/1', '1/1', '7/12'] },
      { key: 'incomeYear', span: ['1/1', '1/1', '1/1', '5/12'] },
    ],
  },
  {
    titleMessage: messages.sectionContributionsTitle,
    fields: [
      { key: 'pensionFundRatio', span: HALF_ROW_SPAN },
      { key: 'privatePensionRatio', span: HALF_ROW_SPAN },
    ],
  },
  {
    titleMessage: messages.sectionPersonalTaxCreditTitle,
    descriptionMessage: messages.sectionPersonalTaxCreditDescription,
    fields: [
      { key: 'taxCardUtilization', span: THIRD_ROW_SPAN },
      { key: 'spouseTaxCardUtilization', span: THIRD_ROW_SPAN },
      { key: 'accumulatedPersonalTaxCredit', span: THIRD_ROW_SPAN },
    ],
  },
  {
    titleMessage: messages.sectionDeductionsTitle,
    descriptionMessage: messages.sectionDeductionsDescription,
    fields: [
      { key: 'vacationPay', span: THIRD_ROW_SPAN },
      { key: 'unionDues', span: THIRD_ROW_SPAN },
      { key: 'otherDeduction', span: THIRD_ROW_SPAN },
    ],
  },
  {
    titleMessage: messages.sectionEmployerPaymentsTitle,
    descriptionMessage: messages.sectionEmployerPaymentsDescription,
    fields: [
      { key: 'employerPensionMatchRatio', span: THIRD_ROW_SPAN },
      { key: 'vehicleAllowance', span: THIRD_ROW_SPAN },
      { key: 'seamenAccidentInsurancePremium', span: THIRD_ROW_SPAN },
    ],
  },
]

const FIELD_SECTIONS_BY_CALCULATOR_TYPE: Partial<
  Record<RskCalculatorType, CalculatorFieldSection[]>
> = {
  [RskCalculatorType.WithholdingTaxOnWages]: WITHHOLDING_TAX_ON_WAGES_SECTIONS,
}

// Keyed by the domain's `RskCalculatorResultRow.group` string. Unknown group
// keys (e.g. a future calculator type) fall back to rendering the raw key.
const GROUP_TITLE_MESSAGES: Record<string, MessageDescriptor> = {
  taxBaseCalculation: messages.groupTaxBaseCalculationTitle,
  withholdingAndPersonalCredit: messages.groupWithholdingAndPersonalCreditTitle,
  employerCosts: messages.groupEmployerCostsTitle,
}

// Field labels come from the GraphQL response, but the id is composed per
// field key so editors can override an individual label through the
// connected component's translation namespace.
const getFieldLabelMessage = (field: RskCalculatorField) => ({
  id: `web.rsk.calculator:field.${field.key}.label`,
  defaultMessage: field.label,
})

const formatResultValue = (
  row: Pick<RskCalculatorResultRow, 'value' | 'unit'>,
) => {
  const numericValue = Number(row.value)
  if (Number.isNaN(numericValue)) return row.value
  if (row.unit === 'ISK') return formatCurrency(numericValue)
  if (row.unit === '%') return `${numericValue}%`
  if (row.unit) return `${numericValue} ${row.unit}`
  return String(numericValue)
}

interface CalculatorFieldProps {
  field: RskCalculatorField
  control: ReturnType<typeof useForm>['control']
  label: string
}

const CalculatorFieldInput = ({
  field,
  control,
  label,
}: CalculatorFieldProps) => {
  const { formatMessage } = useIntl()

  if (field.kind === RskCalculatorFieldKind.Select) {
    const options: Option<string>[] = (field.options ?? []).map((option) => ({
      label: option.label,
      value: option.value,
    }))
    // The first option is the field's default value.
    const defaultValue = options[0]?.value ?? ''
    return (
      <Controller
        control={control}
        name={field.key}
        defaultValue={defaultValue}
        rules={{ required: field.required }}
        render={({ field: { onChange, value } }) => (
          <Select
            label={label}
            placeholder={formatMessage(messages.selectPlaceholder)}
            required={field.required}
            options={options}
            value={options.find((option) => option.value === value)}
            onChange={(option) => onChange(option?.value ?? '')}
          />
        )}
      />
    )
  }

  if (field.kind === RskCalculatorFieldKind.Boolean) {
    return (
      <Controller
        control={control}
        name={field.key}
        defaultValue="false"
        rules={{ required: field.required }}
        render={({ field: { onChange, value } }) => (
          <Stack space={1}>
            <Text variant="medium" fontWeight="light">
              {label}
            </Text>
            <Box display="flex" columnGap={3}>
              <RadioButton
                id={`${field.key}-true`}
                name={field.key}
                label={formatMessage(messages.yes)}
                checked={value === 'true'}
                onChange={() => onChange('true')}
              />
              <RadioButton
                id={`${field.key}-false`}
                name={field.key}
                label={formatMessage(messages.no)}
                checked={value === 'false'}
                onChange={() => onChange('false')}
              />
            </Box>
          </Stack>
        )}
      />
    )
  }

  // RskCalculatorFieldKind.Number
  return (
    <InputController
      id={field.key}
      name={field.key}
      control={control}
      label={label}
      type="number"
      currency={field.unit === 'ISK'}
      suffix={field.unit && field.unit !== 'ISK' ? ` ${field.unit}` : undefined}
      placeholder={
        field.unit === 'ISK' ? 'krónur' : field.unit ?? undefined
      }
      required={field.required}
      min={field.min ?? undefined}
      max={field.max ?? undefined}
      rules={{ required: field.required }}
    />
  )
}

interface CalculatorResultsProps {
  results: RskCalculatorResultRow[]
}

const CalculatorResults = ({ results }: CalculatorResultsProps) => {
  const { formatMessage } = useIntl()
  const groupKeys: string[] = []
  const rowsByGroup: Record<string, RskCalculatorResultRow[]> = {}
  const UNGROUPED = ''

  for (const row of results) {
    const groupKey = row.group ?? UNGROUPED
    if (!rowsByGroup[groupKey]) {
      rowsByGroup[groupKey] = []
      groupKeys.push(groupKey)
    }
    rowsByGroup[groupKey].push(row)
  }

  return (
    <Stack space={4} dividers>
      {groupKeys.map((groupKey) => (
        <Stack key={groupKey || 'ungrouped'} space={1}>
          {groupKey && (
            <Text variant="h5" as="h4">
              {GROUP_TITLE_MESSAGES[groupKey]
                ? formatMessage(GROUP_TITLE_MESSAGES[groupKey])
                : groupKey}
            </Text>
          )}
          <Stack space={1}>
            {rowsByGroup[groupKey].map((row) => (
              <Box
                key={row.key}
                display="flex"
                justifyContent="spaceBetween"
                columnGap={2}
              >
                <Text
                  variant="medium"
                  fontWeight={row.emphasis ? 'semiBold' : 'light'}
                >
                  {row.label}
                </Text>
                <Text
                  variant="medium"
                  fontWeight={row.emphasis ? 'semiBold' : 'light'}
                >
                  {formatResultValue(row)}
                </Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}

interface RSKCalculatorProps {
  slice: ConnectedComponent
}

export const RSKCalculator = ({ slice }: RSKCalculatorProps) => {
  const { formatMessage } = useIntl()
  const { control, getValues } = useForm()

  const calculatorType = getCalculatorType(slice.configJson?.calculatorType)
  const title = formatMessage(messages.title)
  const disclaimer = formatMessage(messages.disclaimer)

  const fieldsResponse = useQuery<
    GetRskCalculatorFieldsQuery,
    GetRskCalculatorFieldsQueryVariables
  >(GET_RSK_CALCULATOR_FIELDS, {
    // `skip` guards the undefined-calculatorType case; the fallback value is
    // never sent because the query is skipped when calculatorType is unset.
    variables: {
      calculatorType: calculatorType ?? RskCalculatorType.ChildBenefit,
    },
    skip: !calculatorType,
  })

  const [
    fetchCalculation,
    {
      data: calculationData,
      loading: calculating,
      called,
      error: calculationError,
    },
  ] = useLazyQuery<
    GetRskCalculatorCalculationQuery,
    GetRskCalculatorCalculationQueryVariables
  >(GET_RSK_CALCULATOR_CALCULATION)

  const fields = fieldsResponse.data?.rskCalculatorFields ?? []
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]))
  const fieldSections = calculatorType
    ? FIELD_SECTIONS_BY_CALCULATOR_TYPE[calculatorType]
    : undefined
  const results = calculationData?.rskCalculatorCalculation ?? []
  // The ungrouped, emphasized row (if any) is the calculator's headline
  // total (e.g. "Heildarlaun eftir frádrátt") -- rendered standalone above
  // the grouped breakdown rather than inside it.
  const headlineRow = results.find((row) => row.emphasis && !row.group)
  const groupedResults = headlineRow
    ? results.filter((row) => row !== headlineRow)
    : results

  const calculate = () => {
    if (!calculatorType) return
    const values = getValues()
    fetchCalculation({
      variables: {
        calculatorType,
        input: fields.map((field) => ({
          key: field.key,
          value: String(values[field.key] ?? ''),
        })),
      },
    })
  }

  if (!calculatorType) {
    return null
  }

  if (fieldsResponse.error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(messages.errorOccurredTitle)}
        message={formatMessage(messages.fieldsErrorMessage)}
      />
    )
  }

  if (fieldsResponse.loading) {
    return <SkeletonLoader height={40} repeat={4} space={2} />
  }

  const hasCalculated = called && !calculationError

  return (
    <Stack space={5}>
      <Box background="overlay" borderRadius="large" padding={6}>
        <Stack space={5}>
          {title && (
            <Text variant="h3" as="h3">
              {title}
            </Text>
          )}
          {fieldSections ? (
            <Stack space={6}>
              {fieldSections.map((section) => {
                const sectionFields = section.fields
                  .map(({ key, span }) => {
                    const field = fieldsByKey.get(key)
                    return field ? { field, span } : undefined
                  })
                  .filter(
                    (
                      entry,
                    ): entry is {
                      field: RskCalculatorField
                      span: NonNullable<GridColumnProps['span']>
                    } => Boolean(entry),
                  )

                if (!sectionFields.length) return null

                return (
                  <Stack key={section.titleMessage.id} space={3}>
                    <Stack space={1}>
                      <Text variant="h4" as="h4">
                        {formatMessage(section.titleMessage)}
                      </Text>
                      {section.descriptionMessage && (
                        <Text variant="medium">
                          {formatMessage(section.descriptionMessage)}
                        </Text>
                      )}
                    </Stack>
                    <GridRow rowGap={3}>
                      {sectionFields.map(({ field, span }) => (
                        <GridColumn key={field.key} span={span}>
                          <CalculatorFieldInput
                            field={field}
                            control={control}
                            label={formatMessage(getFieldLabelMessage(field))}
                          />
                        </GridColumn>
                      ))}
                    </GridRow>
                  </Stack>
                )
              })}
            </Stack>
          ) : (
            <Stack space={3}>
              {fields.map((field) => (
                <CalculatorFieldInput
                  key={field.key}
                  field={field}
                  control={control}
                  label={formatMessage(getFieldLabelMessage(field))}
                />
              ))}
            </Stack>
          )}
          {disclaimer && (
            <Text variant="small" lineHeight="lg">
              {disclaimer}
            </Text>
          )}
          <Box>
            <Button
              loading={calculating}
              onClick={calculate}
              icon={hasCalculated ? 'reload' : undefined}
            >
              {formatMessage(
                hasCalculated ? messages.recalculate : messages.calculate,
              )}
            </Button>
          </Box>
        </Stack>
      </Box>
      {hasCalculated && results.length > 0 && (
        <Box background="purple100" borderRadius="large" padding={6}>
          <Stack space={3}>
            <Text variant="h2" as="h2">
              {headlineRow
                ? `${headlineRow.label}: ${formatResultValue(headlineRow)}`
                : formatMessage(messages.results)}
            </Text>
            <CalculatorResults results={groupedResults} />
          </Stack>
        </Box>
      )}
      {!calculating && called && calculationError && (
        <AlertMessage
          type="error"
          title={formatMessage(messages.errorOccurredTitle)}
          message={formatMessage(messages.errorOccurredMessage)}
        />
      )}
    </Stack>
  )
}

export default RSKCalculator
