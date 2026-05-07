import { Box, Input, Text } from '@island.is/island-ui/core'
import NumberFormat from 'react-number-format'
import type { FieldRendererProps } from '../types'

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

type TitleVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'default'
  | 'small'
  | 'medium'
  | 'intro'
  | 'eyebrow'

export const SdfDisplayField = ({
  component,
  currentValue,
  displayValues,
}: FieldRendererProps) => {
  const titleVariant = allowedTitleVariants.has(component.titleVariant ?? '')
    ? (component.titleVariant as TitleVariant)
    : 'h4'
  const overlayValue =
    component.id && displayValues ? displayValues[component.id] : undefined
  const rawValue =
    overlayValue ?? (currentValue as string | undefined) ?? component.value ?? ''
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
      alignItems={component.halfWidthOwnline ? 'flexEnd' : undefined}
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
