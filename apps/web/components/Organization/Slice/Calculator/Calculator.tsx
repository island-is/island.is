import { useState } from 'react'
import { Controller, useForm, useFormState } from 'react-hook-form'
import { MessageDescriptor, useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'

import {
  evaluateCondition,
  calculatorConfigSchema,
} from '@island.is/shared/calculator-config'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridColumnProps,
  GridRow,
  Option,
  Select,
  SkeletonLoader,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  Calculator as CalculatorSlice,
  GetTaxCalculatorCalculationQuery,
  GetTaxCalculatorCalculationQueryVariables,
  GetTaxCalculatorFieldsQuery,
  GetTaxCalculatorFieldsQueryVariables,
  TaxCalculatorField,
  TaxCalculatorFieldKind,
  TaxCalculatorResultRow,
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'
import {
  GET_TAX_CALCULATOR_CALCULATION,
  GET_TAX_CALCULATOR_FIELDS,
} from '@island.is/web/screens/queries/TaxCalculator'
import { formatCurrency } from '@island.is/web/utils/currency'

import { messages } from './messages'

// The `configJson.calculatorType` value is locale-independent and selects
// which calculator this slice instance calls. It is intentionally
// English/camelCase and does not need to match the GraphQL enum's wire value.
const CALCULATOR_TYPE_BY_CONFIG_VALUE: Record<string, TaxCalculatorType> = {
  withholdingTaxOnWages: TaxCalculatorType.WithholdingTaxOnWages,
  childBenefit: TaxCalculatorType.ChildBenefit,
  vehicleTax: TaxCalculatorType.VehicleTax,
  vehicleBenefit: TaxCalculatorType.VehicleBenefit,
}

const getCalculatorType = (value: unknown): TaxCalculatorType | undefined => {
  if (typeof value !== 'string') return undefined
  return CALCULATOR_TYPE_BY_CONFIG_VALUE[value]
}

// GridColumn's `span` type is a finite string-literal union (e.g. '4/12'),
// not `${number}/12` in general, so a 1-12 count needs an explicit lookup
// rather than a template literal.
const GRID_SPAN_COLUMNS = [
  '1/12',
  '2/12',
  '3/12',
  '4/12',
  '5/12',
  '6/12',
  '7/12',
  '8/12',
  '9/12',
  '10/12',
  '11/12',
  '12/12',
] as const

// A section field's `span` is a 1-12 column count on a 12-column grid,
// editor-authored. Stacks to full width below the largest breakpoint, then
// uses the exact fraction at the largest one -- a small simplification vs.
// the previous hardcoded THIRD_ROW_SPAN, which also showed an intermediate
// two-column state at the medium breakpoint; accepted as a minor difference.
const spanToGridColumn = (
  span: number,
): NonNullable<GridColumnProps['span']> => [
  '1/1',
  '1/1',
  '1/1',
  GRID_SPAN_COLUMNS[span - 1],
]

// Keyed by the domain's `TaxCalculatorResultRow.group` string. Unknown group
// keys (e.g. a future calculator type) fall back to rendering the raw key.
const GROUP_TITLE_MESSAGES: Record<string, MessageDescriptor> = {
  taxBaseCalculation: messages.groupTaxBaseCalculationTitle,
  withholdingAndPersonalCredit: messages.groupWithholdingAndPersonalCreditTitle,
  employerCosts: messages.groupEmployerCostsTitle,
  fyrraTimabil: messages.groupFyrraTimabilTitle,
  seinnaTimabil: messages.groupSeinnaTimabilTitle,
}

// Field labels come from the GraphQL response, but the id is composed per
// field key so editors can override an individual label through the linked
// translation namespace.
const getFieldLabelMessage = (field: TaxCalculatorField) => ({
  id: `web.rsk.calculatorSlice:field.${field.key}.label`,
  defaultMessage: field.label,
})

// Section title/description are editor-authored in configJson (the
// default/Icelandic text, same role as `field.label`); the linked
// translation namespace supplies the override, keyed by the section's
// stable `key` (not its position, which shifts on reorder).
const getSectionTitleMessage = (section: { key: string; title: string }) => ({
  id: `web.rsk.calculatorSlice:section.${section.key}.title`,
  defaultMessage: section.title,
})

const getSectionDescriptionMessage = (section: {
  key: string
  description?: string
}) => ({
  id: `web.rsk.calculatorSlice:section.${section.key}.description`,
  defaultMessage: section.description ?? '',
})

const formatResultValue = (
  row: Pick<TaxCalculatorResultRow, 'value' | 'unit'>,
) => {
  const numericValue = Number(row.value)
  if (Number.isNaN(numericValue)) return row.value
  if (row.unit === 'ISK') return formatCurrency(numericValue)
  if (row.unit === '%') return `${numericValue}%`
  if (row.unit) return `${numericValue} ${row.unit}`
  return String(numericValue)
}

interface CalculatorFieldProps {
  field: TaxCalculatorField
  control: ReturnType<typeof useForm>['control']
  label: string
  disabled: boolean
}

const CalculatorFieldInput = ({
  field,
  control,
  label,
  disabled,
}: CalculatorFieldProps) => {
  const { formatMessage } = useIntl()
  const { errors } = useFormState({ control, name: field.key })
  const fieldError = errors[field.key]
  const errorMessage = fieldError
    ? formatMessage(
        // 'validate' is only used by the CHECKBOX branch's required check.
        fieldError.type === 'required' || fieldError.type === 'validate'
          ? messages.fieldRequiredError
          : messages.fieldRangeError,
      )
    : undefined
  // A field disabled via `disabledWhen` stays mounted but the user cannot
  // edit it -- a `required` rule would otherwise block submission forever.
  const isRequired = field.required && !disabled

  if (field.kind === TaxCalculatorFieldKind.Select) {
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
        rules={{ required: isRequired }}
        render={({ field: { onChange, value } }) => (
          <Select
            label={label}
            placeholder={formatMessage(messages.selectPlaceholder)}
            required={isRequired}
            isDisabled={disabled}
            hasError={Boolean(errorMessage)}
            errorMessage={errorMessage}
            options={options}
            value={options.find((option) => option.value === value)}
            onChange={(option) => onChange(option?.value ?? '')}
          />
        )}
      />
    )
  }

  if (field.kind === TaxCalculatorFieldKind.Boolean) {
    return (
      <Controller
        control={control}
        name={field.key}
        defaultValue="false"
        rules={{ required: field.required }}
        render={({ field: { onChange, value } }) => (
          <ToggleSwitchCheckbox
            label={label}
            checked={value === 'true'}
            disabled={disabled}
            onChange={(checked) => onChange(checked ? 'true' : 'false')}
          />
        )}
      />
    )
  }

  if (field.kind === TaxCalculatorFieldKind.Checkbox) {
    return (
      <Controller
        control={control}
        name={field.key}
        defaultValue="false"
        // The value is the string "true"/"false", which never satisfies
        // react-hook-form's `required` emptiness check (only "" or
        // null/undefined do) -- a required checkbox needs an explicit
        // `validate` rule checking the actual value instead.
        rules={{
          validate: (value) => !isRequired || value === 'true' || 'required',
        }}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            large
            label={label}
            checked={value === 'true'}
            disabled={disabled}
            hasError={Boolean(errorMessage)}
            errorMessage={errorMessage}
            onChange={(event) =>
              onChange(event.target.checked ? 'true' : 'false')
            }
          />
        )}
      />
    )
  }

  if (field.kind === TaxCalculatorFieldKind.Text) {
    return (
      <InputController
        id={field.key}
        name={field.key}
        control={control}
        label={label}
        type="text"
        required={isRequired}
        disabled={disabled}
        error={errorMessage}
        rules={{ required: isRequired }}
      />
    )
  }

  // TaxCalculatorFieldKind.Number
  return (
    <InputController
      id={field.key}
      disabled={disabled}
      name={field.key}
      control={control}
      label={label}
      type="number"
      currency={field.unit === 'ISK'}
      suffix={field.unit && field.unit !== 'ISK' ? ` ${field.unit}` : undefined}
      placeholder={field.unit === 'ISK' ? 'krónur' : field.unit ?? undefined}
      required={isRequired}
      min={field.min ?? undefined}
      max={field.max ?? undefined}
      // No calculator field is meant to accept a negative value.
      allowNegative={false}
      error={errorMessage}
      rules={{
        required: isRequired,
        min: field.min ?? undefined,
        max: field.max ?? undefined,
      }}
    />
  )
}

interface CalculatorResultsProps {
  results: TaxCalculatorResultRow[]
}

const CalculatorResults = ({ results }: CalculatorResultsProps) => {
  const { formatMessage } = useIntl()
  const groupKeys: string[] = []
  const rowsByGroup: Record<string, TaxCalculatorResultRow[]> = {}
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

interface CalculatorProps {
  slice: CalculatorSlice
}

const Calculator = ({ slice }: CalculatorProps) => {
  const { formatMessage } = useIntl()
  // A field hidden by `visibleWhen` unmounts (its Controller/InputController
  // stops rendering). Without shouldUnregister, react-hook-form would keep
  // that field registered -- submitting its stale last value, and (if
  // required) permanently failing `trigger()` since the user has no way to
  // fix a field that's no longer rendered.
  const { control, getValues, watch, trigger } = useForm({
    shouldUnregister: true,
  })
  const [sectionToggles, setSectionToggles] = useState<Record<string, boolean>>(
    {},
  )

  const parsedConfig = calculatorConfigSchema.safeParse(slice.configJson)
  const config = parsedConfig.success ? parsedConfig.data : undefined
  const calculatorType = getCalculatorType(config?.calculatorType)
  const title = formatMessage(messages.title)
  const disclaimer = formatMessage(messages.disclaimer)

  const fieldsResponse = useQuery<
    GetTaxCalculatorFieldsQuery,
    GetTaxCalculatorFieldsQueryVariables
  >(GET_TAX_CALCULATOR_FIELDS, {
    // `skip` guards the undefined-calculatorType case; the fallback value is
    // never sent because the query is skipped when calculatorType is unset.
    variables: {
      calculatorType: calculatorType ?? TaxCalculatorType.ChildBenefit,
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
    GetTaxCalculatorCalculationQuery,
    GetTaxCalculatorCalculationQueryVariables
  >(GET_TAX_CALCULATOR_CALCULATION)

  const fields = fieldsResponse.data?.taxCalculatorFields ?? []
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]))
  const sections = config?.sections ?? []
  const results = calculationData?.taxCalculatorCalculation ?? []
  // The ungrouped, emphasized row (if any) is the calculator's headline
  // total (e.g. "Heildarlaun eftir frádrátt") -- rendered standalone above
  // the grouped breakdown rather than inside it.
  const headlineRow = results.find((row) => row.emphasis && !row.group)
  const groupedResults = headlineRow
    ? results.filter((row) => row !== headlineRow)
    : results

  const watchedValues = watch()

  const calculate = async () => {
    if (!calculatorType) return
    const isValid = await trigger()
    if (!isValid) return
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

  if (!calculatorType || !parsedConfig.success) {
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
          <Stack space={6}>
            {sections.map((section) => {
              const sectionFields = section.fields
                .map((sectionField) => {
                  const field = fieldsByKey.get(sectionField.key)
                  if (!field) return undefined
                  const isVisible =
                    !sectionField.visibleWhen ||
                    evaluateCondition(sectionField.visibleWhen, watchedValues)
                  if (!isVisible) return undefined
                  const isDisabled = Boolean(
                    sectionField.disabledWhen &&
                      evaluateCondition(
                        sectionField.disabledWhen,
                        watchedValues,
                      ),
                  )
                  return {
                    field,
                    span: sectionField.span,
                    disabled: isDisabled,
                  }
                })
                .filter(
                  (
                    entry,
                  ): entry is {
                    field: TaxCalculatorField
                    span: number
                    disabled: boolean
                  } => Boolean(entry),
                )

              if (!section.toggleLabel && !sectionFields.length) return null

              const isToggledOn = section.toggleLabel
                ? sectionToggles[section.key] ?? false
                : true

              return (
                <Stack key={section.key} space={3}>
                  {section.toggleLabel && (
                    <ToggleSwitchCheckbox
                      label={section.toggleLabel}
                      checked={isToggledOn}
                      onChange={(checked) =>
                        setSectionToggles((prev) => ({
                          ...prev,
                          [section.key]: checked,
                        }))
                      }
                    />
                  )}
                  {isToggledOn && (
                    <>
                      {(section.title || section.description) && (
                        <Stack space={1}>
                          {section.title && (
                            <Text variant="h4" as="h4">
                              {formatMessage(getSectionTitleMessage(section))}
                            </Text>
                          )}
                          {section.description && (
                            <Text variant="medium">
                              {formatMessage(
                                getSectionDescriptionMessage(section),
                              )}
                            </Text>
                          )}
                        </Stack>
                      )}
                      <GridRow rowGap={3}>
                        {sectionFields.map(({ field, span, disabled }) => (
                          <GridColumn
                            key={field.key}
                            span={spanToGridColumn(span)}
                          >
                            <CalculatorFieldInput
                              field={field}
                              control={control}
                              label={formatMessage(getFieldLabelMessage(field))}
                              disabled={disabled}
                            />
                          </GridColumn>
                        ))}
                      </GridRow>
                    </>
                  )}
                </Stack>
              )
            })}
          </Stack>
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

export default Calculator
