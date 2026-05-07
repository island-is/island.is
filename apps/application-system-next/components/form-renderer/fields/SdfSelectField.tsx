import { Box, Select } from '@island.is/island-ui/core'
import { SDF_FIELD_CONTROL_PADDING_TOP } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfSelectField = ({
  component,
  currentValue,
  error,
  handleChange,
  dispatch,
}: FieldRendererProps) => (
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
          component.options?.find((opt) => opt.value === (currentValue as string))
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
