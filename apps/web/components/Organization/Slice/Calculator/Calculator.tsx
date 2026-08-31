import { Fragment, useState } from 'react'
import { Controller, useForm, useFormState } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'
import format from 'date-fns/format'

import {
  CalculatorLocalizedText,
  CalculatorSectionField,
  calculatorConfigSchema,
} from '@island.is/shared/calculator-config'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  DatePicker,
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
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'
import {
  GET_TAX_CALCULATOR_CALCULATION,
  GET_TAX_CALCULATOR_FIELDS,
} from '@island.is/web/screens/queries/TaxCalculator'

import { messages } from './messages'

// `slice.calculatorType` (the entry's own `type` field in Contentful) is
// locale-independent and selects which calculator this slice instance
// calls. It is intentionally English/camelCase and does not need to match
// the GraphQL enum's wire value.
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

// Every piece of editor-authored display text is an inline bilingual pair
// (see calculatorConfig.schema.ts) rather than a linked-translation
// override -- the backend has no opinion on this text at all. Falls back
// through current-locale -> Icelandic -> an optional backend default (used
// for field labels, since taxCalculatorFields only ever provides Icelandic)
// so nothing ever renders blank.
const pickLocalizedText = (
  text: CalculatorLocalizedText | undefined,
  locale: string,
  fallback?: string,
): string =>
  (locale === 'en' ? text?.en : undefined) || text?.is || fallback || ''

interface CalculatorFieldProps {
  field: TaxCalculatorField
  control: ReturnType<typeof useForm>['control']
  label: string
  locale: string
  placeholder: string
  disabled: boolean
}

const CalculatorFieldInput = ({
  field,
  control,
  label,
  locale,
  placeholder,
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
  // A field greyed out by a toggle gate (`disableOnly`) stays mounted but
  // the user cannot edit it -- a `required` rule would otherwise block
  // submission forever.
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
            placeholder={
              placeholder || formatMessage(messages.selectPlaceholder)
            }
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
        placeholder={placeholder || undefined}
        required={isRequired}
        disabled={disabled}
        error={errorMessage}
        rules={{ required: isRequired }}
      />
    )
  }

  if (field.kind === TaxCalculatorFieldKind.Date) {
    return (
      <Controller
        control={control}
        name={field.key}
        defaultValue=""
        rules={{ required: isRequired }}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            id={field.key}
            name={field.key}
            label={label}
            placeholderText={placeholder || undefined}
            locale={locale === 'en' ? 'en' : 'is'}
            required={isRequired}
            disabled={disabled}
            hasError={Boolean(errorMessage)}
            errorMessage={errorMessage}
            selected={value ? new Date(value) : undefined}
            handleChange={(date) =>
              onChange(date ? format(date, 'yyyy-MM-dd') : '')
            }
          />
        )}
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
      placeholder={
        placeholder ||
        (field.unit === 'ISK' ? 'krónur' : field.unit) ||
        undefined
      }
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

interface CalculatorProps {
  slice: CalculatorSlice
}

const Calculator = ({ slice }: CalculatorProps) => {
  const { formatMessage, locale } = useIntl()
  // A field in a section hidden by its toggle gate unmounts (its
  // Controller/InputController stops rendering). Without shouldUnregister,
  // react-hook-form would keep
  // that field registered -- submitting its stale last value, and (if
  // required) permanently failing `trigger()` since the user has no way to
  // fix a field that's no longer rendered.
  const { control, getValues, trigger } = useForm({
    shouldUnregister: true,
  })
  // Toggle switches are UI-only: they gate sections and are never submitted,
  // so their state lives here rather than in the form.
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({})

  const parsedConfig = calculatorConfigSchema.safeParse(slice.configJson)
  const config = parsedConfig.success ? parsedConfig.data : undefined
  const calculatorType = getCalculatorType(slice.calculatorType)

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
    { loading: calculating, called, error: calculationError },
  ] = useLazyQuery<
    GetTaxCalculatorCalculationQuery,
    GetTaxCalculatorCalculationQueryVariables
  >(GET_TAX_CALCULATOR_CALCULATION)

  const fields = fieldsResponse.data?.taxCalculatorFields ?? []
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]))
  const sections = config?.sections ?? []

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
          <Stack space={6}>
            {sections.map((section) => {
              // Conditional behaviour lives on the section, not the field,
              // and is driven entirely by editor-declared toggles rather than
              // by any field's value. A section owning a toggle keeps its
              // switch rendered and hides only its body while off; a section
              // suppressed by someone else's toggle either unmounts (taking
              // every field inside it with it) or greys out.
              const ownToggle = section.toggle
              const isOwnToggleOn = ownToggle
                ? Boolean(toggleStates[ownToggle.key])
                : true

              const isSuppressed = Boolean(
                section.gate && toggleStates[section.gate.toggle],
              )
              if (isSuppressed && !section.gate?.disableOnly) return null
              const isSectionDisabled = isSuppressed

              const sectionFields = section.fields
                .map((sectionField) => {
                  const field = fieldsByKey.get(sectionField.key)
                  if (!field) return undefined
                  return { field, sectionField, span: sectionField.span }
                })
                .filter(
                  (
                    entry,
                  ): entry is {
                    field: TaxCalculatorField
                    sectionField: CalculatorSectionField
                    span: number
                  } => Boolean(entry),
                )

              if (!sectionFields.length) return null

              const sectionTitle = pickLocalizedText(section.title, locale)
              const sectionDescription = pickLocalizedText(
                section.description,
                locale,
              )

              const body = (
                <Stack space={3}>
                  {(sectionTitle || sectionDescription) && (
                    <Stack space={1}>
                      {sectionTitle && (
                        <Text variant="h4" as="h4">
                          {sectionTitle}
                        </Text>
                      )}
                      {sectionDescription && (
                        <Text variant="medium">{sectionDescription}</Text>
                      )}
                    </Stack>
                  )}
                  <GridRow rowGap={3}>
                    {sectionFields.map(({ field, span, sectionField }) => (
                      <GridColumn key={field.key} span={spanToGridColumn(span)}>
                        <CalculatorFieldInput
                          field={field}
                          control={control}
                          label={pickLocalizedText(
                            sectionField.label,
                            locale,
                            field.label,
                          )}
                          locale={locale}
                          placeholder={pickLocalizedText(
                            sectionField.placeholder,
                            locale,
                          )}
                          disabled={isSectionDisabled}
                        />
                      </GridColumn>
                    ))}
                  </GridRow>
                </Stack>
              )

              if (!ownToggle) {
                return <Fragment key={section.key}>{body}</Fragment>
              }

              return (
                <Stack key={section.key} space={3}>
                  <ToggleSwitchCheckbox
                    label={pickLocalizedText(ownToggle.label, locale)}
                    checked={isOwnToggleOn}
                    onChange={(checked) =>
                      setToggleStates((previous) => ({
                        ...previous,
                        [ownToggle.key]: checked,
                      }))
                    }
                  />
                  {/* Revealed content sits on its own card, per the design. */}
                  {isOwnToggleOn && (
                    <Box background="white" borderRadius="large" padding={4}>
                      {body}
                    </Box>
                  )}
                </Stack>
              )
            })}
          </Stack>
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
