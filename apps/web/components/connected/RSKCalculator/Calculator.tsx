import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
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

import { m } from './Calculator.strings'

// The Contentful `configJson.calculatorType` value is locale-independent and
// selects which calculator this slice instance calls. It is intentionally
// English/camelCase and does not need to match the GraphQL enum's wire value.
const CALCULATOR_TYPE_BY_CONFIG_VALUE: Record<string, RskCalculatorType> = {
  withholdingTaxOnWages: RskCalculatorType.WithholdingTaxOnWages,
  childBenefit: RskCalculatorType.ChildBenefit,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getCalculatorType = (value: unknown): RskCalculatorType | undefined => {
  if (typeof value !== 'string') return undefined
  return CALCULATOR_TYPE_BY_CONFIG_VALUE[value]
}

// slice.json is localized and only ever carries bespoke, per-instance copy
// overrides for this generic component -- never the field schema itself,
// which is owned by the GraphQL response.
const getLocalizedStringField = (
  json: unknown,
  key: string,
): string | undefined => {
  if (!isRecord(json)) return undefined
  const value = json[key]
  return typeof value === 'string' ? value : undefined
}

const getFieldLabelOverride = (
  json: unknown,
  fieldKey: string,
): string | undefined => {
  if (!isRecord(json)) return undefined
  const overrides = json.fieldOverrides
  if (!isRecord(overrides)) return undefined
  const entry = overrides[fieldKey]
  if (!isRecord(entry)) return undefined
  return typeof entry.label === 'string' ? entry.label : undefined
}

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
    return (
      <Controller
        control={control}
        name={field.key}
        defaultValue=""
        rules={{ required: field.required }}
        render={({ field: { onChange, value } }) => (
          <Select
            label={label}
            placeholder={formatMessage(m.selectPlaceholder)}
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
                label={formatMessage(m.yes)}
                checked={value === 'true'}
                onChange={() => onChange('true')}
              />
              <RadioButton
                id={`${field.key}-false`}
                name={field.key}
                label={formatMessage(m.no)}
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
    <Stack space={4}>
      {groupKeys.map((groupKey) => (
        <Stack key={groupKey || 'ungrouped'} space={1}>
          {groupKey && (
            <Text variant="h5" as="h4">
              {groupKey}
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
  const title = getLocalizedStringField(slice.json, 'title')
  const disclaimer = getLocalizedStringField(slice.json, 'disclaimer')

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
  const results = calculationData?.rskCalculatorCalculation ?? []

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
        title={formatMessage(m.errorOccurredTitle)}
        message={formatMessage(m.fieldsErrorMessage)}
      />
    )
  }

  if (fieldsResponse.loading) {
    return <SkeletonLoader height={40} repeat={4} space={2} />
  }

  return (
    <Stack space={5}>
      {title && (
        <Text variant="h3" as="h3">
          {title}
        </Text>
      )}
      <Stack space={3}>
        {fields.map((field) => (
          <CalculatorFieldInput
            key={field.key}
            field={field}
            control={control}
            label={getFieldLabelOverride(slice.json, field.key) ?? field.label}
          />
        ))}
      </Stack>
      {disclaimer && (
        <Text variant="small" lineHeight="lg">
          {disclaimer}
        </Text>
      )}
      <Box>
        <Button loading={calculating} onClick={calculate}>
          {formatMessage(m.calculate)}
        </Button>
      </Box>
      {called && !calculationError && results.length > 0 && (
        <Box
          background="blue100"
          paddingY={[3, 3, 5]}
          paddingX={[3, 3, 3, 3, 6]}
        >
          <Stack space={3}>
            <Text variant="h4" as="h4">
              {formatMessage(m.results)}
            </Text>
            <CalculatorResults results={results} />
          </Stack>
        </Box>
      )}
      {!calculating && called && calculationError && (
        <AlertMessage
          type="error"
          title={formatMessage(m.errorOccurredTitle)}
          message={formatMessage(m.errorOccurredMessage)}
        />
      )}
    </Stack>
  )
}

export default RSKCalculator
