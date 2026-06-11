import { Box, Select } from '@island.is/island-ui/core'
import { SDF_FIELD_CONTROL_PADDING_TOP } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

const getSelectedOptions = (
  options: Array<{ label: string; value: string }>,
  currentValue: unknown,
) => {
  if (Array.isArray(currentValue)) {
    return options.filter((opt) => currentValue.includes(opt.value))
  }

  const selected = options.find((opt) => opt.value === (currentValue as string))
  return selected ?? undefined
}

export const SdfSelectField = ({
  component,
  currentValue,
  error,
  handleChange,
  dispatch,
}: FieldRendererProps) => {
  const options =
    component.options?.map((opt) => ({
      label: opt.label,
      value: opt.value,
    })) ?? []

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
          isMulti={component.isMulti}
          options={options}
          value={getSelectedOptions(options, currentValue)}
          onChange={(selectedOptions) => {
            handleChange(
              Array.isArray(selectedOptions)
                ? selectedOptions.map((opt) => opt.value)
                : selectedOptions?.value,
            )
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
}
