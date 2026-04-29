'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import type {
  SdfComponentData,
  SdfDataTableEditableRow,
  SdfDataTableRow,
  SdfValidationError,
  ClientCondition,
} from '../lib/graphql'
import { evaluateClientCondition } from '../lib/evaluateClientCondition'
import {
  getCustomComponent,
  validateCustomComponentProps,
  isCustomComponentWriteAllowed,
} from './registry'
import {
  SDF_FIELD_BLOCK_MARGIN_BOTTOM,
  SDF_FIELD_CONTROL_PADDING_TOP,
} from './sdfLayoutTokens'
import {
  AlertMessage,
  AccordionCard,
  Accordion,
  AccordionItem,
  AsyncSearch,
  Box,
  Text,
  Button,
  Icon,
  Input,
  InputError,
  Select,
  RadioButton,
  Checkbox,
  DatePicker,
  Divider,
  BulletList,
  LinkV2,
  GridRow,
  GridColumn,
  LoadingDots,
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import type { InputBackgroundColor } from '@island.is/island-ui/core/types'
import NumberFormat from 'react-number-format'

const resolveTextInputBackgroundColor = (
  component: SdfComponentData,
): InputBackgroundColor => {
  const c = component.inputBackgroundColor
  if (c === 'white' || c === 'blue') return c
  return 'blue'
}

const buildSdfTextFieldLabel = (
  component: SdfComponentData,
  valueStr: string,
): string | undefined => {
  const core = component.label?.trim()
  if (!core) return undefined
  if (component.showMaxLength && component.maxLength != null) {
    return `${core} (${valueStr.length}/${component.maxLength})`
  }
  return core
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getObjectAnswer = (value: unknown): Record<string, unknown> =>
  isRecord(value) ? value : {}

const getStringAnswerValue = (
  value: Record<string, unknown>,
  key: string,
): string => {
  const result = value[key]
  return typeof result === 'string' ? result : ''
}

const getDataTableUnits = (
  value: Record<string, unknown>,
): Record<string, unknown>[] =>
  Array.isArray(value.units)
    ? value.units.filter((unit): unit is Record<string, unknown> =>
        isRecord(unit),
      )
    : []

const getDataTableUnitKey = (unit: Record<string, unknown>): string => {
  const propertyCode = unit.propertyCode
  const unitCode = unit.unitCode
  if (propertyCode !== undefined && unitCode !== undefined) {
    return `${propertyCode}_${unitCode}`
  }
  const id = unit.id ?? unit.rowId
  return id !== undefined ? String(id) : ''
}

const parseDataTableInputValue = (
  value: string,
  type: string,
): string | number => {
  if (type !== 'number') {
    return value
  }
  if (value.trim() === '') {
    return 0
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const FULL_ROW_TYPES = new Set([
  'SdfRadioField',
  'SdfCheckboxField',
  'SdfDisplayField',
  'SdfAlertMessageField',
  'SdfExpandableDescriptionField',
  'SdfAccordionField',
  'SdfStaticTableField',
  'SdfDataTableField',
  'SdfSearchField',
  'SdfFileUploadField',
  'SdfSliderField',
  'SdfDividerField',
  'SdfTitleField',
  'SdfDescriptionField',
  'SdfExternalDataProviderField',
  'SdfInformationCardField',
  'SdfPaymentChargeOverviewField',
])

const isHalfWidthCandidate = (comp: SdfComponentData): boolean =>
  comp.width === 'HALF' && !FULL_ROW_TYPES.has(comp.__typename)

const groupComponentsIntoRows = (
  components: SdfComponentData[],
): SdfComponentData[][] => {
  const rows: SdfComponentData[][] = []
  let i = 0

  while (i < components.length) {
    const comp = components[i]
    if (isHalfWidthCandidate(comp)) {
      const row: SdfComponentData[] = [comp]
      if (
        i + 1 < components.length &&
        isHalfWidthCandidate(components[i + 1])
      ) {
        row.push(components[i + 1])
        i += 2
      } else {
        i += 1
      }
      rows.push(row)
    } else {
      rows.push([comp])
      i += 1
    }
  }

  return rows
}

export type SdfFormDispatch = (
  actionType: string,
  extraAnswers?: Record<string, unknown>,
  fieldIds?: string[],
  event?: string,
  refetchTemplateApiActions?: string[],
  refetchTargets?: string[],
) => void | Promise<void>

interface FormRendererProps {
  components: SdfComponentData[]
  errors: SdfValidationError[]
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
  dispatch?: SdfFormDispatch
  /**
   * Optional live-computed values for `SdfDisplayField` components. The backend
   * recomputes these from the VALIDATE action in response to form input; the
   * overlay is applied without mutating persisted answers.
   */
  displayValues?: Record<string, string>
  pendingRefetchTargets?: string[]
}

export const FormRenderer = ({
  components,
  errors,
  answers,
  onAnswerChange,
  dispatch,
  displayValues,
  pendingRefetchTargets = [],
}: FormRendererProps) => {
  const errorMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const err of errors) {
      map[err.componentId] = err.message
    }
    return map
  }, [errors])

  const rows = groupComponentsIntoRows(components)

  return (
    <Box>
      {rows.map((row, rowIdx) => {
        if (row.length === 1 && row[0].width !== 'HALF') {
          const component = row[0]
          return (
            <ComponentSwitch
              key={component.id ?? `component-${rowIdx}`}
              component={component}
              error={component.id ? errorMap[component.id] : undefined}
              answers={answers}
              onAnswerChange={onAnswerChange}
              dispatch={dispatch}
              displayValues={displayValues}
              pendingRefetchTargets={pendingRefetchTargets}
            />
          )
        }

        return (
          <GridRow key={`row-${rowIdx}`}>
            {row.map((component, colIdx) => (
              <GridColumn
                key={component.id ?? `col-${rowIdx}-${colIdx}`}
                span={['1/1', '1/2']}
                paddingBottom={0}
              >
                <ComponentSwitch
                  component={component}
                  error={component.id ? errorMap[component.id] : undefined}
                  answers={answers}
                  onAnswerChange={onAnswerChange}
                  dispatch={dispatch}
                  displayValues={displayValues}
                  pendingRefetchTargets={pendingRefetchTargets}
                />
              </GridColumn>
            ))}
          </GridRow>
        )
      })}
    </Box>
  )
}

interface ComponentSwitchProps {
  component: SdfComponentData
  error?: string
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
  dispatch?: SdfFormDispatch
  displayValues?: Record<string, string>
  pendingRefetchTargets?: string[]
}

const ComponentSwitch = ({
  component,
  error,
  answers,
  onAnswerChange,
  dispatch,
  displayValues,
  pendingRefetchTargets = [],
}: ComponentSwitchProps) => {
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [expandedDataTableRows, setExpandedDataTableRows] = useState<
    Record<string, boolean>
  >({})

  const handleChange = useCallback(
    (value: unknown) => {
      if (component.id) {
        onAnswerChange(component.id, value)
      }
    },
    [component.id, onAnswerChange],
  )

  const visible = evaluateClientCondition(
    component.clientCondition as ClientCondition | null | undefined,
    answers,
  )

  if (!visible) return null

  const currentValue = component.id ? answers[component.id] : undefined
  const isRefetchPending = component.id
    ? pendingRefetchTargets.includes(component.id)
    : false

  switch (component.__typename) {
    case 'SdfTextField': {
      const inputVariant = component.inputVariant ?? 'text'
      const isTextarea = inputVariant === 'textarea'
      const valueStr = String(
        (currentValue as string | undefined) ?? component.defaultValue ?? '',
      )
      const bg = resolveTextInputBackgroundColor(component)
      const label = buildSdfTextFieldLabel(component, valueStr)
      const placeholder = component.placeholder ?? ''
      const inputCommon = {
        id: component.id ?? '',
        name: component.id ?? '',
        placeholder,
        disabled: component.disabled,
        maxLength: component.maxLength ?? undefined,
        required: component.required,
        hasError: !!error,
        errorMessage: error,
        size: 'md' as const,
        backgroundColor: bg,
        readOnly: component.readOnly === true,
        rightAlign: component.rightAlign === true,
        label,
      }

      if (isTextarea) {
        return (
          <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
            <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
              <Input
                {...inputCommon}
                value={valueStr}
                onChange={(e) => handleChange(e.target.value)}
                textarea
                rows={component.textareaRows ?? undefined}
              />
            </Box>
          </Box>
        )
      }

      const isCurrency = inputVariant === 'currency'
      const isNumber = inputVariant === 'number'
      const useNumericFormat = isCurrency || isNumber
      const thousandSep =
        component.thousandSeparator === true || isCurrency
      const suffix =
        component.textSuffix != null && component.textSuffix !== ''
          ? component.textSuffix
          : isCurrency
          ? ' kr.'
          : undefined
      const allowNegative = component.allowNegative !== false

      if (useNumericFormat) {
        return (
          <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
            <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
              <NumberFormat
                customInput={Input}
                {...inputCommon}
                value={valueStr}
                suffix={suffix}
                thousandSeparator={thousandSep ? '.' : undefined}
                decimalSeparator={thousandSep ? ',' : undefined}
                allowNegative={allowNegative}
                type={isCurrency ? ('text' as const) : undefined}
                min={isNumber ? component.textNumberMin : undefined}
                max={isNumber ? component.textNumberMax : undefined}
                isAllowed={(values) => {
                  const { floatValue } = values
                  if (
                    isNumber &&
                    typeof component.textNumberMax === 'number' &&
                    floatValue != null
                  ) {
                    return floatValue <= component.textNumberMax
                  }
                  return true
                }}
                onValueChange={({ value }) => {
                  handleChange(value)
                }}
              />
            </Box>
          </Box>
        )
      }

      const fmt = component.textFormat
      if (
        fmt &&
        (inputVariant === 'text' ||
          inputVariant === 'tel' ||
          inputVariant === 'email')
      ) {
        return (
          <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
            <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
              <NumberFormat
                customInput={Input}
                {...inputCommon}
                type={
                  inputVariant === 'email'
                    ? ('email' as const)
                    : inputVariant === 'tel'
                    ? ('tel' as const)
                    : ('text' as const)
                }
                value={valueStr}
                format={fmt}
                onValueChange={({ value }) => {
                  handleChange(value)
                }}
              />
            </Box>
          </Box>
        )
      }

      return (
        <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <Input
              {...inputCommon}
              value={valueStr}
              onChange={(e) => handleChange(e.target.value)}
              type={
                isNumber
                  ? ('number' as const)
                  : inputVariant === 'email'
                  ? ('email' as const)
                  : inputVariant === 'tel'
                  ? ('tel' as const)
                  : ('text' as const)
              }
              min={isNumber ? component.textNumberMin : undefined}
              max={isNumber ? component.textNumberMax : undefined}
              step={isNumber ? component.textStep : undefined}
            />
          </Box>
        </Box>
      )
    }

    case 'SdfSearchField': {
      const searchValue = getObjectAnswer(currentValue)
      const selectedValue = getStringAnswerValue(searchValue, 'value')
      const selectedLabel = getStringAnswerValue(searchValue, 'label')
      const query = getStringAnswerValue(searchValue, 'query') || selectedLabel
      const minQueryLength = component.minQueryLength ?? 3
      const searchRefetchPending = (component.refetchTargets ?? []).some((target) =>
        pendingRefetchTargets.includes(target),
      )

      return (
        <Box
          marginBottom={
            component.refetchTargets?.length ? 0 : SDF_FIELD_BLOCK_MARGIN_BOTTOM
          }
        >
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <AsyncSearch
              options={component.options ?? []}
              placeholder={component.placeholder ?? ''}
              initialInputValue={selectedLabel}
              inputValue={query}
              closeMenuOnSubmit
              openMenuOnFocus
              size="large"
              colored
              loading={searchRefetchPending}
              onChange={(selection: { value: string; label?: string } | null) => {
                const selectedOption = component.options?.find(
                  (option) => option.value === selection?.value,
                )
                const nextValue = selection
                  ? {
                      ...searchValue,
                      value: selection.value,
                      label: selectedOption?.label ?? selection.label ?? '',
                      query: selectedOption?.label ?? selection.label ?? '',
                    }
                  : { query: '' }
                handleChange(nextValue)
                if (component.onSelectRefetchTemplateApis?.length && dispatch) {
                  void dispatch(
                    'REFETCH',
                    component.id ? { [component.id]: nextValue } : undefined,
                    undefined,
                    undefined,
                    component.onSelectRefetchTemplateApis,
                    component.refetchTargets,
                  )
                }
              }}
              onInputValueChange={(nextQuery: string) => {
                const nextValue = { ...searchValue, query: nextQuery }
                handleChange(nextValue)
                if (searchDebounceRef.current) {
                  clearTimeout(searchDebounceRef.current)
                }
                if (
                  !dispatch ||
                  !component.searchAction ||
                  (nextQuery.length > 0 && nextQuery.length < minQueryLength)
                ) {
                  return
                }
                searchDebounceRef.current = setTimeout(() => {
                  void dispatch(
                    'REFETCH',
                    component.id ? { [component.id]: nextValue } : undefined,
                    undefined,
                    undefined,
                    [component.searchAction ?? ''],
                    undefined,
                  )
                }, 300)
              }}
            />
            {error && (
              <Box marginTop={1}>
                <InputError errorMessage={error} />
              </Box>
            )}
            {selectedValue && <input type="hidden" value={selectedValue} readOnly />}
          </Box>
        </Box>
      )
    }

    case 'SdfSelectField':
      return (
        <Box marginBottom={5}>
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <Select
              name={component.id ?? ''}
              label={component.label ?? ''}
              placeholder={component.placeholder ?? 'Select...'}
              backgroundColor="blue"
              isDisabled={component.disabled}
              required={component.required}
              hasError={!!error}
              errorMessage={error}
              options={
                component.options?.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                })) ?? []
              }
              value={
                component.options?.find(
                  (opt) => opt.value === (currentValue as string),
                )
                  ? {
                      label:
                        component.options.find(
                          (opt) => opt.value === (currentValue as string),
                        )?.label ?? '',
                      value: (currentValue as string) ?? '',
                    }
                  : undefined
              }
              onChange={(opt) => {
                handleChange(opt?.value)
                if (component.onSelectRefetchTemplateApis?.length && dispatch) {
                  void dispatch(
                    'REFETCH',
                    undefined,
                    undefined,
                    undefined,
                    component.onSelectRefetchTemplateApis,
                    component.refetchTargets,
                  )
                }
              }}
            />
          </Box>
        </Box>
      )

    case 'SdfRadioField': {
      /** Same layout as `RadioController` + `RadioFormField` (application-system-form). */
      const radioLabel = (component.label ?? '').trim()
      const split: '1/1' | '1/2' =
        String(component.width ?? '').toUpperCase() === 'HALF'
          ? '1/2'
          : '1/1'

      const optionList = component.options ?? []

      return (
        <Box marginBottom={1} paddingTop={0} width="full">
          {radioLabel ? (
            <Text variant="h4" as="h4" marginBottom={2}>
              {component.label}
            </Text>
          ) : null}
          {split === '1/2' ? (
            <>
              {/** Equal flex slots: large radios otherwise shrink-wrap and cluster left vs full-width Select */}
              <Box
                display="flex"
                flexDirection={['column', 'row']}
                width="full"
                columnGap={2}
                rowGap={2}
                paddingTop={2}
              >
                {optionList.map((opt) => (
                  <Box key={opt.value} flexGrow={1} minWidth={0}>
                    <Box width="full">
                      <RadioButton
                        id={`${component.id}-${opt.value}`}
                        name={component.id ?? ''}
                        label={opt.label}
                        value={opt.value}
                        checked={currentValue === opt.value}
                        disabled={component.disabled}
                        onChange={() => handleChange(opt.value)}
                        hasError={!!error}
                        large
                        backgroundColor="blue"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              {error ? (
                <Box paddingTop={2}>
                  <InputError errorMessage={error} />
                </Box>
              ) : null}
            </>
          ) : (
            <GridRow width="full">
              {optionList.map((opt) => (
                <GridColumn
                  key={opt.value}
                  span={['1/1', split]}
                  paddingBottom={0}
                  paddingTop={2}
                >
                  <RadioButton
                    id={`${component.id}-${opt.value}`}
                    name={component.id ?? ''}
                    label={opt.label}
                    value={opt.value}
                    checked={currentValue === opt.value}
                    disabled={component.disabled}
                    onChange={() => handleChange(opt.value)}
                    hasError={!!error}
                    large
                    backgroundColor="blue"
                  />
                </GridColumn>
              ))}
              {error ? (
                <GridColumn span={['1/1', split]} paddingBottom={0} paddingTop={2}>
                  <InputError errorMessage={error} />
                </GridColumn>
              ) : null}
            </GridRow>
          )}
        </Box>
      )
    }

    case 'SdfCheckboxField': {
      const split: '1/1' | '1/2' =
        component.width === 'HALF' ? '1/2' : '1/1'
      const spacing: 0 | 1 | 2 =
        component.spacing === 0 || component.spacing === 1
          ? component.spacing
          : 2
      const checkboxBg =
        component.checkboxBackgroundColor === 'white'
          ? 'white'
          : component.checkboxBackgroundColor === 'blue'
          ? 'blue'
          : undefined
      const currentArray = Array.isArray(currentValue)
        ? (currentValue as string[])
        : []
      return (
        <Box marginBottom={3}>
          {component.label && (
            <Text variant="h4">
              {component.label}
              {component.required && component.label && (
                <Text as="span" color="red600">
                  {' '}
                  *
                </Text>
              )}
            </Text>
          )}
          {component.description && (
            <FieldDescription description={component.description} />
          )}
          <Box paddingTop={2}>
            <GridRow>
              {component.options?.map((opt, index) => {
                const checked = currentArray.includes(opt.value)
                return (
                  <GridColumn
                    key={`option-${opt.value}-${index}`}
                    span={['1/1', split]}
                    paddingBottom={spacing}
                  >
                    <Checkbox
                      id={`${component.id}[${index}]`}
                      name={component.id ?? ''}
                      label={opt.label}
                      value={opt.value}
                      checked={checked}
                      disabled={component.disabled}
                      large={component.large}
                      strong={component.strong}
                      backgroundColor={checkboxBg}
                      hasError={!!error}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange([...currentArray, opt.value])
                        } else {
                          handleChange(
                            currentArray.filter((v) => v !== opt.value),
                          )
                        }
                      }}
                    />
                  </GridColumn>
                )
              })}
              {error && (
                <GridColumn span={['1/1', split]} paddingBottom={2}>
                  <InputError errorMessage={error} />
                </GridColumn>
              )}
            </GridRow>
          </Box>
        </Box>
      )
    }

    case 'SdfDateField':
      return (
        <Box marginBottom={3}>
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <DatePicker
              id={component.id ?? ''}
              label={component.label ?? ''}
              placeholderText={component.placeholder}
              disabled={component.disabled}
              minDate={
                component.minDate ? new Date(component.minDate) : undefined
              }
              maxDate={
                component.maxDate ? new Date(component.maxDate) : undefined
              }
              required={component.required}
              hasError={!!error}
              errorMessage={error}
              selected={
                currentValue ? new Date(currentValue as string) : undefined
              }
              handleChange={(date) =>
                handleChange(date.toISOString().split('T')[0])
              }
              size="md"
            />
          </Box>
        </Box>
      )

    case 'SdfPhoneField':
      return (
        <Box marginBottom={3}>
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <Input
              id={component.id ?? ''}
              name={component.id ?? ''}
              label={component.label ?? ''}
              placeholder={component.placeholder ?? ''}
              disabled={component.disabled}
              required={component.required}
              hasError={!!error}
              errorMessage={error}
              type="tel"
              value={(currentValue as string) ?? ''}
              onChange={(e) => handleChange(e.target.value)}
              size={component.width === 'HALF' ? 'xs' : 'md'}
            />
          </Box>
        </Box>
      )

    case 'SdfNationalIdField':
      return (
        <Box marginBottom={3}>
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <Input
              id={component.id ?? ''}
              name={component.id ?? ''}
              label={component.label ?? ''}
              placeholder="000000-0000"
              disabled={component.disabled}
              required={component.required}
              hasError={!!error}
              errorMessage={error}
              value={(currentValue as string) ?? ''}
              onChange={(e) => handleChange(e.target.value)}
              size="xs"
            />
          </Box>
        </Box>
      )

    case 'SdfFileUploadField':
      return (
        <Box marginBottom={3}>
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <Input
              id={component.id ?? ''}
              name={component.id ?? ''}
              label={component.label ?? ''}
              disabled={component.disabled}
              required={component.required}
              hasError={!!error}
              errorMessage={error}
              type="file"
            />
          </Box>
        </Box>
      )

    case 'SdfDescriptionField': {
      const primaryLabel = (component.label ?? '').trim()
      const secondaryText = (component.description ?? '').trim()
      const hasPrimary = primaryLabel.length > 0
      const hasSecondary = secondaryText.length > 0
      return (
        <Box
          marginTop={component.marginTop}
          marginBottom={component.marginBottom ?? 3}
        >
          {hasPrimary && hasSecondary ? (
            <>
              <Text variant="h3" marginBottom={1}>
                {component.label}
              </Text>
              <Text>{component.description}</Text>
            </>
          ) : hasPrimary ? (
            <Text>{component.label}</Text>
          ) : hasSecondary ? (
            <Text>{component.description}</Text>
          ) : null}
        </Box>
      )
    }

    case 'SdfDividerField':
      return (
        <Box marginY={3}>
          <Divider />
        </Box>
      )

    case 'SdfKeyValueField':
      return (
        <Box
          marginBottom={2}
          display="flex"
          justifyContent="spaceBetween"
          paddingY={2}
          borderBottomWidth="standard"
          borderColor="blue200"
        >
          <Text fontWeight="semiBold">{component.label}</Text>
          <Text>{component.value}</Text>
        </Box>
      )

    case 'SdfAlertMessageField':
      return (
        <Box marginBottom={3}>
          <AlertMessage
            type={
              (component.alertType as
                | 'info'
                | 'error'
                | 'warning'
                | 'success') ?? 'info'
            }
            title={component.title ?? ''}
            message={component.message}
          />
        </Box>
      )

    case 'SdfLinkField':
      return (
        <Box marginBottom={2}>
          <LinkV2
            href={component.url ?? '#'}
            newTab
            color="blue400"
            underline="normal"
          >
            {component.label}
          </LinkV2>
        </Box>
      )

    case 'SdfDisplayField': {
      const allowedTitleVariants = new Set([
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'default',
        'small',
        'medium',
        'intro',
        'eyebrow',
      ])
      const titleVariant = allowedTitleVariants.has(
        component.titleVariant ?? '',
      )
        ? (component.titleVariant as
            | 'h1'
            | 'h2'
            | 'h3'
            | 'h4'
            | 'h5'
            | 'default'
            | 'small'
            | 'medium'
            | 'intro'
            | 'eyebrow')
        : 'h4'
      const overlayValue =
        component.id && displayValues
          ? displayValues[component.id]
          : undefined
      const rawValue =
        overlayValue ??
        (currentValue as string | undefined) ??
        component.value ??
        ''
      const isCurrency = component.inputVariant === 'currency'
      const isNumber = component.inputVariant === 'number'
      const useNumericFormat = isCurrency || isNumber
      const suffix =
        component.textSuffix != null && component.textSuffix !== ''
          ? component.textSuffix
          : isCurrency
          ? ' kr.'
          : undefined
      const commonInputProps = {
        id: component.id ?? '',
        name: component.id ?? '',
        label: component.displayInputLabel ?? '',
        readOnly: true,
        backgroundColor: 'blue' as const,
        size: 'md' as const,
        rightAlign: component.rightAlign === true,
      }
      const input = useNumericFormat ? (
        <NumberFormat
          customInput={Input}
          {...commonInputProps}
          value={String(rawValue)}
          suffix={suffix}
          thousandSeparator={isCurrency ? '.' : undefined}
          decimalSeparator={isCurrency ? ',' : undefined}
          type={isCurrency ? ('text' as const) : undefined}
        />
      ) : (
        <Input {...commonInputProps} value={String(rawValue)} />
      )
      return (
        <Box
          paddingY={3}
          display="flex"
          flexDirection="column"
          alignItems={
            component.halfWidthOwnline ? 'flexEnd' : undefined
          }
        >
          <Box
            width={component.halfWidthOwnline ? 'half' : 'full'}
            paddingLeft={component.halfWidthOwnline ? 'p2' : undefined}
          >
            {component.label && (
              <Text variant={titleVariant} paddingBottom={1}>
                {component.label}
              </Text>
            )}
            {input}
          </Box>
        </Box>
      )
    }

    case 'SdfSliderField':
      return (
        <Box marginBottom={3}>
          <Text variant="h5" marginBottom={1}>
            {component.label}
          </Text>
          <input
            id={component.id}
            type="range"
            min={component.min}
            max={component.max}
            step={component.step ?? 1}
            defaultValue={
              (currentValue as string) ?? String(component.min ?? 0)
            }
            onChange={(e) => handleChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="small" color="dark300">
              {component.min}
            </Text>
            <Text variant="small" color="dark300">
              {String(currentValue ?? component.min ?? 0)}
            </Text>
            <Text variant="small" color="dark300">
              {component.max}
            </Text>
          </Box>
        </Box>
      )

    case 'SdfSubmitField':
      return (
        <Box marginBottom={3} display="flex" flexDirection="row" columnGap={2}>
          {component.actions?.map((action) => (
            <Button
              key={action.event}
              variant={action.type === 'primary' ? 'primary' : 'ghost'}
              size="default"
            >
              {action.name}
            </Button>
          ))}
        </Box>
      )

    case 'SdfImageField':
      return (
        <Box marginBottom={3}>
          <Text fontWeight="semiBold" marginBottom={1}>
            {component.label}
          </Text>
          {component.imageUrl && (
            <Box borderRadius="large" overflow="hidden">
              <img
                src={component.imageUrl}
                alt={component.label ?? ''}
                style={{ maxWidth: '100%', display: 'block' }}
              />
            </Box>
          )}
        </Box>
      )

    case 'SdfBankAccountField':
      return (
        <Box marginBottom={3}>
          <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
            <Input
              id={component.id ?? ''}
              name={component.id ?? ''}
              label={component.label ?? ''}
              placeholder="0000-00-000000"
              disabled={component.disabled}
              hasError={!!error}
              errorMessage={error}
              value={(currentValue as string) ?? ''}
              onChange={(e) => handleChange(e.target.value)}
            />
          </Box>
        </Box>
      )

    case 'SdfInformationCardField': {
      const rows = component.informationCardItems ?? []
      return (
        <Box
          marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}
          border="standard"
          borderColor="blue200"
          borderWidth="standard"
          paddingY={2}
          paddingX={2}
        >
          {rows.map((row, i) => (
            <Box display="flex" key={`${row.label}-${i}`} paddingY={1}>
              <Text fontWeight="semiBold">
                {row.label}
                &nbsp;
              </Text>
              <Box>
                <Text>{row.value}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      )
    }

    case 'SdfPaymentChargeOverviewField': {
      const lines = component.paymentChargeLines ?? []
      return (
        <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
          <Text variant="h3" as="h4" marginY={2}>
            {component.paymentChargeHeading}
          </Text>
          {lines.map((line, i) => (
            <Box
              key={`${line.description}-${i}`}
              paddingTop={1}
              display="flex"
              justifyContent="spaceBetween"
            >
              <Text>{line.description}</Text>
              <Text>{line.amount}</Text>
            </Box>
          ))}
          <Box paddingY={3}>
            <Divider />
          </Box>
          <Box display="flex" justifyContent="spaceBetween" paddingBottom={2}>
            <Text variant="h5">{component.paymentChargeTotalLabel}</Text>
            <Text color="blue400" variant="h3">
              {component.paymentChargeTotalAmount}
            </Text>
          </Box>
        </Box>
      )
    }

    case 'SdfPdfLinkButtonField':
      return (
        <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
          <Text variant="small" marginBottom={1}>
            {component.pdfDescription}
          </Text>
          <LinkV2 href={component.pdfLinkUrl ?? '#'}>
            {component.pdfLinkTitle}
          </LinkV2>
        </Box>
      )

    case 'SdfCopyLinkField':
      return (
        <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
          {component.copyLinkTitle && (
            <Text variant="h5" marginBottom={1}>
              {component.copyLinkTitle}
            </Text>
          )}
          <Text>{component.copyLinkText}</Text>
          {component.copyButtonTitle && (
            <Box marginTop={2}>
              <Button size="small">{component.copyButtonTitle}</Button>
            </Box>
          )}
        </Box>
      )

    case 'SdfCustomComponent':
      return (
        <CustomComponentRenderer
          componentName={component.componentName!}
          rawProps={component.props ?? '{}'}
          onAnswerChange={onAnswerChange}
        />
      )

    case 'SdfRepeaterComponent':
      return (
        <Box
          marginBottom={3}
          border="standard"
          borderRadius="large"
          padding={3}
        >
          <Text fontWeight="semiBold" marginBottom={2}>
            {component.addItemLabel ?? 'Items'}
          </Text>
          <Text variant="small" color="dark300">
            Repeater rendering handled by the backend. Items are re-evaluated on
            REFETCH.
          </Text>
        </Box>
      )

    case 'SdfExpandableDescriptionField':
      return (
        <Box marginTop={2} marginBottom={2}>
          <AccordionCard
            id={`expandable-${component.id}`}
            label={component.label ?? ''}
            labelVariant="h3"
          >
            {component.introText && (
              <Box marginBottom={4}>
                <Text>{component.introText}</Text>
              </Box>
            )}
            {component.description && (
              <BulletList space="gutter" type="ul">
                <Text>{component.description}</Text>
              </BulletList>
            )}
          </AccordionCard>
        </Box>
      )

    case 'SdfMessageWithLinkButtonField':
      return (
        <Box marginTop={2} marginBottom={2}>
          <Box
            borderRadius="standard"
            padding={4}
            background="blue100"
            display={['block', 'block', 'flex']}
            alignItems="center"
            justifyContent="spaceBetween"
            flexDirection={['column', 'column', 'row']}
            marginY={2}
          >
            <Box paddingRight={[0, 0, 4]}>
              <Text variant="small">{component.message}</Text>
            </Box>
            <Box marginTop={[3, 3, 0]} marginLeft={[0, 0, 3]}>
              <Button
                onClick={() => {
                  window.open(component.url ?? '#', '_blank')
                }}
                size="small"
                icon="arrowForward"
                nowrap
              >
                {component.buttonTitle}
              </Button>
            </Box>
          </Box>
        </Box>
      )

    case 'SdfAccordionField':
      return (
        <Box marginBottom={3}>
          {component.label && (
            <Text variant="h3" marginBottom={2}>
              {component.label}
            </Text>
          )}
          <Accordion>
            {(
              component.items as
                | { label: string; content: string }[]
                | undefined
            )?.map((item, i) => (
              <AccordionItem
                key={i}
                id={`accordion-${component.id}-${i}`}
                label={item.label}
              >
                <Text>{item.content}</Text>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )

    case 'SdfDataTableField': {
      const tableValue = getObjectAnswer(currentValue)
      const selectedUnits = getDataTableUnits(tableValue)
      const dataRows = (component.rows ?? []) as SdfDataTableRow[]
      const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
      }
      const headerCellStyle: React.CSSProperties = {
        background: '#f2f7ff',
        padding: '24px 16px',
        fontSize: 14,
        fontWeight: 700,
        textAlign: 'left',
        lineHeight: 1.25,
      }
      const parentCellStyle: React.CSSProperties = {
        padding: '24px 16px',
        borderBottom: '1px solid #e6ecf7',
        textAlign: 'left',
        verticalAlign: 'middle',
      }
      const childCellStyle: React.CSSProperties = {
        padding: '16px',
        borderBottom: '1px solid #e6ecf7',
        background: '#f2f7ff',
        textAlign: 'left',
        verticalAlign: 'middle',
      }
      const numericCellStyle: React.CSSProperties = {
        ...childCellStyle,
        textAlign: 'right',
        whiteSpace: 'nowrap',
      }
      const inputStyle: React.CSSProperties = {
        width: '100%',
        minWidth: 0,
        padding: '10px',
        fontSize: 14,
        textAlign: 'right',
        border: '1px solid #CCDFFF',
        borderRadius: 8,
        background: '#fff',
        boxSizing: 'border-box',
      }
      const toggleButtonStyle = (expanded: boolean): React.CSSProperties => ({
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: 0,
        background: expanded ? '#00e4ca' : '#fff',
        color: '#00103f',
        cursor: 'pointer',
        lineHeight: '24px',
        padding: 0,
        fontWeight: 700,
      })

      const getSelectedUnit = (rowId: string) =>
        selectedUnits.find((unit) => getDataTableUnitKey(unit) === rowId)

      const setSelectedUnits = (nextUnits: Record<string, unknown>[]) => {
        handleChange({
          ...tableValue,
          units: nextUnits,
        })
      }

      const updateSelectedUnit = (
        rowId: string,
        patch: Record<string, unknown>,
      ) => {
        setSelectedUnits(
          selectedUnits.map((unit) =>
            getDataTableUnitKey(unit) === rowId ? { ...unit, ...patch } : unit,
          ),
        )
      }

      const toggleEditableRow = (
        editableRow: SdfDataTableEditableRow,
        checked: boolean,
      ) => {
        const rowId = editableRow.id
        if (!checked) {
          setSelectedUnits(
            selectedUnits.filter((unit) => getDataTableUnitKey(unit) !== rowId),
          )
          return
        }

        const defaults = editableRow.defaultValues ?? {}
        const inputDefaults = Object.fromEntries(
          editableRow.inputs.map((input) => [
            input.key,
            defaults[input.key] ??
              (input.type === 'number' ? 0 : ''),
          ]),
        )
        const nextUnit = {
          ...(editableRow.payload ?? { id: rowId }),
          ...inputDefaults,
          checked: true,
        }

        setSelectedUnits([
          ...selectedUnits.filter((unit) => getDataTableUnitKey(unit) !== rowId),
          nextUnit,
        ])
      }

      return (
        <Box marginBottom={3}>
          {component.label && (
            <Text variant="h3" marginBottom={2}>
              {component.label}
            </Text>
          )}
          {isRefetchPending ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              paddingY={5}
            >
              <LoadingDots />
            </Box>
          ) : dataRows.length === 0 ? null : (
            <Box marginTop={6} overflow="auto">
              <table style={tableStyle}>
                <colgroup>
                  <col style={{ width: 56 }} />
                  <col style={{ width: '50%' }} />
                  <col style={{ width: '22%' }} />
                  <col style={{ width: 130 }} />
                  <col style={{ width: 88 }} />
                </colgroup>
                {component.header && component.header.length > 0 ? (
                  <thead>
                    <tr>
                      <th style={{ ...headerCellStyle, width: 56 }} />
                      {component.header.map((h: string, i: number) => (
                        <th
                          key={i}
                          style={{
                            ...headerCellStyle,
                            textAlign: i >= 2 ? 'right' : 'left',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {dataRows.map((row) => {
                    const expanded = expandedDataTableRows[row.id] === true
                    const childRows = row.expandable?.rows ?? []

                    return (
                      <React.Fragment key={row.id}>
                        <tr>
                          <td style={{ ...parentCellStyle, textAlign: 'center' }}>
                            {childRows.length > 0 && (
                              <button
                                type="button"
                                style={toggleButtonStyle(expanded)}
                                onClick={() =>
                                  setExpandedDataTableRows((current) => ({
                                    ...current,
                                    [row.id]: !expanded,
                                  }))
                                }
                                aria-label={
                                  expanded
                                    ? `Collapse ${row.id}`
                                    : `Expand ${row.id}`
                                }
                              >
                                {expanded ? '-' : '+'}
                              </button>
                            )}
                          </td>
                          {row.cells.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={
                                cellIndex >= 2
                                  ? { ...parentCellStyle, textAlign: 'right' }
                                  : parentCellStyle
                              }
                            >
                              <Text fontWeight="regular" variant="medium">
                                {cell}
                              </Text>
                            </td>
                          ))}
                        </tr>
                        {expanded &&
                          childRows.map((editableRow) => {
                            const selectedUnit = getSelectedUnit(editableRow.id)
                            const checked = selectedUnit !== undefined
                            return (
                              <tr key={editableRow.id}>
                                <td style={childCellStyle} />
                                <td style={childCellStyle}>
                                  {editableRow.hasCheckbox ? (
                                    <Checkbox
                                      id={`${component.id}-${editableRow.id}-checked`}
                                      name={`${component.id}-${editableRow.id}-checked`}
                                      label={editableRow.label}
                                      checked={checked}
                                      onChange={(event) =>
                                        toggleEditableRow(
                                          editableRow,
                                          event.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <Text variant="medium">
                                      {editableRow.label}
                                    </Text>
                                  )}
                                </td>
                                <td style={childCellStyle}>
                                  <Text variant="medium">
                                    {editableRow.cells[0] ?? ''}
                                  </Text>
                                </td>
                                {editableRow.inputs.map((input) => {
                                  const value =
                                    selectedUnit?.[input.key] ??
                                    editableRow.defaultValues?.[input.key] ??
                                    ''
                                  return (
                                    <td key={input.key} style={numericCellStyle}>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'flex-end',
                                          gap: 4,
                                        }}
                                      >
                                        <input
                                          name={`${component.id}-${editableRow.id}-${input.key}`}
                                          type="text"
                                          min={input.min}
                                          max={input.max}
                                          step={
                                            input.type === 'number'
                                              ? 'any'
                                              : undefined
                                          }
                                          disabled={!checked}
                                          style={{
                                            ...inputStyle,
                                            flex: input.suffix ? '1 1 auto' : undefined,
                                            opacity: checked ? 1 : 0.7,
                                          }}
                                          value={String(value)}
                                          onChange={(event) =>
                                            updateSelectedUnit(editableRow.id, {
                                              [input.key]: parseDataTableInputValue(
                                                event.target.value,
                                                input.type,
                                              ),
                                            })
                                          }
                                        />
                                        {input.suffix ? (
                                          <span style={{ fontSize: 14, flexShrink: 0 }}>
                                            {input.suffix}
                                          </span>
                                        ) : null}
                                      </div>
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </Box>
          )}
          {error && (
            <Box marginTop={1}>
              <InputError errorMessage={error} />
            </Box>
          )}
        </Box>
      )
    }

    case 'SdfStaticTableField': {
      const staticRows = (component.rows ?? []) as string[][]
      if (staticRows.length === 0) {
        return null
      }
      return (
        <Box marginBottom={3}>
          {component.label && (
            <Text variant="h3" marginBottom={2}>
              {component.label}
            </Text>
          )}
          <Box overflow="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {component.header && component.header.length > 0 ? (
                <thead>
                  <tr>
                    {component.header.map((h: string, i: number) => (
                      <th key={i} style={{ textAlign: 'left' }}>
                        <Box
                          paddingY={2}
                          paddingX={3}
                          borderBottomWidth="standard"
                          borderColor="blue200"
                        >
                          <Text fontWeight="semiBold" variant="small">
                            {h}
                          </Text>
                        </Box>
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {staticRows.map((row: string[], ri: number) => (
                  <tr key={ri}>
                    {row.map((cell: string, ci: number) => (
                      <td key={ci}>
                        <Box
                          paddingY={2}
                          paddingX={3}
                          borderBottomWidth="standard"
                          borderColor="blue100"
                        >
                          <Text variant="small">{cell}</Text>
                        </Box>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      )
    }

    case 'SdfHiddenInputField':
    case 'SdfHiddenInputWithWatchedValueField':
      return null

    case 'SdfExternalDataProviderField': {
      const isApproved = currentValue === true
      return (
        <Box>
          <Box marginTop={2} marginBottom={5}>
            <Box display="flex" alignItems="center" justifyContent="flexStart">
              <Box marginRight={1}>
                <Icon
                  icon="fileTrayFull"
                  size="medium"
                  color="blue400"
                  type="outline"
                />
              </Box>
              <Text variant="h4">
                {component.subTitle ??
                  'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki'}
              </Text>
            </Box>
            {component.description && (
              <Box marginTop={4}>
                <Text>{component.description}</Text>
              </Box>
            )}
          </Box>
          <Box marginBottom={5}>
            {component.dataProviders?.map((dp: any) => (
              <Box key={dp.id} marginBottom={3}>
                <Text variant="h4" color="blue400">
                  {dp.title}
                </Text>
                {dp.subTitle && <Text>{dp.subTitle}</Text>}
              </Box>
            ))}
          </Box>
          <Checkbox
            name={component.id ?? ''}
            label={component.checkboxLabel ?? 'Ég samþykki'}
            checked={isApproved}
            onChange={(e) => handleChange(e.target.checked)}
            hasError={!!error}
            large
            backgroundColor="blue"
          />
          {error && (
            <Box marginTop={1}>
              <Text variant="small" color="red600">
                {error}
              </Text>
            </Box>
          )}
        </Box>
      )
    }

    case 'SdfRedirectToServicePortalField':
    case 'SdfPaymentPendingField':
    case 'SdfTitleField':
    case 'SdfPaginatedSearchableTableField':
    case 'SdfNationalIdWithNameField':
    case 'SdfFieldsRepeaterField':
    case 'SdfOverviewField':
    case 'SdfVehiclePermnoWithInfoField':
    case 'SdfCompanySearchField':
    case 'SdfAsyncSelectField':
    case 'SdfActionCardListField':
    case 'SdfTableRepeaterField':
    case 'SdfFindVehicleField':
      return (
        <Box
          marginBottom={2}
          padding={2}
          background="blue100"
          borderRadius="large"
        >
          <Text variant="small" color="dark300">
            [{component.__typename}] {component.label ?? component.id}
          </Text>
        </Box>
      )

    default:
      return null
  }
}

const CustomComponentRenderer = ({
  componentName,
  rawProps,
  onAnswerChange,
}: {
  componentName: string
  rawProps: string
  onAnswerChange: (fieldId: string, value: unknown) => void
}) => {
  const { component: Component } = getCustomComponent(componentName)
  const { parsed } = validateCustomComponentProps(componentName, rawProps)
  const allowWrites = isCustomComponentWriteAllowed(componentName)

  const DynComponent = Component as React.ComponentType<Record<string, unknown>>

  return (
    <DynComponent
      componentName={componentName}
      onAnswerChange={allowWrites ? onAnswerChange : undefined}
      {...parsed}
    />
  )
}
