import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfCheckboxField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => {
  const split: '1/1' | '1/2' = component.width === 'HALF' ? '1/2' : '1/1'
  const spacing: 0 | 1 | 2 =
    component.spacing === 0 || component.spacing === 1 ? component.spacing : 2
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
    <Box {...getSdfFieldMargins(component)}>
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
                      handleChange(currentArray.filter((v) => v !== opt.value))
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
