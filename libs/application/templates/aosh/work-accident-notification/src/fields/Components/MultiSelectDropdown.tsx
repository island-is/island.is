import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Group, Item } from './MultiSelectDropdownController'
import { Box, Select } from '@island.is/island-ui/core'
import { Controller } from 'react-hook-form'
import { Option } from '../Components/types'

type MultiSelectDropdownProps = {
  group: Group
  options: Item[]
  onChange: (values: Option[], code: string) => void
}

export const MultiSelectDropdown: FC<
  React.PropsWithChildren<MultiSelectDropdownProps & FieldBaseProps>
> = (props) => {
  const { group, options, onChange } = props

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
              //value={}
              onChange={(ev) => {
                onChange(ev as Option[], group.code)
              }}
            />
          )
        }}
        name={'group'}
      />
    </Box>
  )
}
