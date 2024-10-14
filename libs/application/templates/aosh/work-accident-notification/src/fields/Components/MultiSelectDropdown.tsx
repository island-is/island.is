import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Group, Item } from './MultiSelectDropdownController'
import { Box, Select } from '@island.is/island-ui/core'
import { Controller } from 'react-hook-form'
import { Option } from '../Components/types'

type MultiSelectDropdownProps = {
  group: Group
  options: Item[]
  onChange: (
    values: Option[],
    code: string,
    checked: boolean,
    fullItemCode: string,
  ) => void
  values: Option[]
}

export const MultiSelectDropdown: FC<
  React.PropsWithChildren<MultiSelectDropdownProps & FieldBaseProps>
> = (props) => {
  const { group, options, onChange, values } = props

  return (
    <Box marginTop={1}>
      <Controller
        render={() => {
          return (
            <Select
              id={group.name}
              backgroundColor="blue"
              name="tag-select"
              isMulti={true}
              label={group.name}
              // placeholder={group.name}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              options={options.map((option) => ({
                value: option.code,
                label: option.name,
                withCheckmark: true,
                isSelected: option.isSelected,
              }))}
              value={values}
              onChange={(ev, meta) => {
                if (meta.action === 'select-option') {
                  onChange(
                    ev.map(({ value, label }) => ({
                      value,
                      label,
                    })) as Option[],
                    group.code.substring(0, 1),
                    true,
                    meta.option?.value || '',
                  )
                } else if (meta.action === 'remove-value') {
                  onChange(
                    [meta.removedValue] as Option[],
                    group.code.substring(0, 1),
                    false,
                    meta.removedValue?.value,
                  )
                } else if (meta.action === 'deselect-option') {
                  onChange(
                    [meta.option] as Option[],
                    group.code.substring(0, 1),
                    false,
                    meta.option?.value || '',
                  )
                }
              }}
            />
          )
        }}
        name={'group'}
      />
    </Box>
  )
}
