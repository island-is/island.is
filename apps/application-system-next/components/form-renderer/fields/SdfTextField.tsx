import { Box, Input } from '@island.is/island-ui/core'
import type { InputBackgroundColor } from '@island.is/island-ui/core/types'
import NumberFormat from 'react-number-format'
import type { SdfComponentData } from '../../../lib/graphql'
import {
  SDF_FIELD_BLOCK_MARGIN_BOTTOM,
  SDF_FIELD_CONTROL_PADDING_TOP,
} from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

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

export const SdfTextField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => {
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
  const thousandSep = component.thousandSeparator === true || isCurrency
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
              console.log('[SDF display debug] SdfTextField onValueChange', {
                id: component.id,
                value,
              })
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
                ? ('email' as 'text')
                : inputVariant === 'tel'
                ? ('tel' as const)
                : ('text' as const)
            }
            value={valueStr}
            format={fmt}
            onValueChange={({ value }) => {
              console.log('value', value)
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
