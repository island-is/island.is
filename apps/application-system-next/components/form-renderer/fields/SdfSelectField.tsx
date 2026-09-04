import { Box, Select } from '@island.is/island-ui/core'
import {
  SDF_FIELD_CONTROL_PADDING_TOP,
  getSdfFieldMargins,
} from '../../sdfLayoutTokens'
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
    <Box {...getSdfFieldMargins(component)}>
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
            // Fire a screen-rebuild REFETCH when the select either needs new
            // template-API data (`onSelectRefetchTemplateApis`) or only needs
            // dependent fields re-resolved against the new answer
            // (`refetchTargets`) — e.g. a checkbox whose server-resolved
            // `options` depend on the just-selected value but whose data is
            // already in externalData, so no template API needs to run.
            if (
              (component.onSelectRefetchTemplateApis?.length ||
                component.refetchTargets?.length) &&
              dispatch
            ) {
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
