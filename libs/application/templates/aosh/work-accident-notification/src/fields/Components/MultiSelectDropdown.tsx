import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { Group, Item } from './MultiSelectDropdownController'
import { Box, Select } from '@island.is/island-ui/core'
import { Controller } from 'react-hook-form'
import { Option } from '../Components/types'

type MultiSelectDropdownProps = {
  group: Group
  options: Item[]
  onChange: (values: Option[], code: string, checked: boolean) => void
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
              options={options.map((option) => ({
                value: option.code,
                label: option.name,
              }))}
              value={values}
              onChange={(ev, meta) => {
                if (meta.action === 'select-option') {
                  onChange(ev as Option[], group.code.substring(0, 1), true)
                } else if (meta.action === 'remove-value') {
                  onChange(
                    [meta.removedValue] as Option[],
                    group.code.substring(0, 1),
                    false,
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
