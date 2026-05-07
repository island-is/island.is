import {
  Box,
  GridColumn,
  GridRow,
  InputError,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import type { FieldRendererProps } from '../types'

export const SdfRadioField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => {
  /** Same layout as `RadioController` + `RadioFormField` (application-system-form). */
  const radioLabel = (component.label ?? '').trim()
  const split: '1/1' | '1/2' =
    String(component.width ?? '').toUpperCase() === 'HALF' ? '1/2' : '1/1'

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
        <GridRow>
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
