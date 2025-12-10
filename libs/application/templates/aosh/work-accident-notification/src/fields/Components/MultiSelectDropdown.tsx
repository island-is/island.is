import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Group, Item } from './MultiSelectDropdownController'
import { Box, Select } from '@island.is/island-ui/core'
import { Option } from './types'
import { useLocale } from '@island.is/localization'
import { causeAndConsequences } from '../../lib/messages'

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
  majorGroupLength: number
}

export const MultiSelectDropdown: FC<
  React.PropsWithChildren<MultiSelectDropdownProps & FieldBaseProps>
> = (props) => {
  const { group, options, onChange, values, majorGroupLength } = props
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={3}>
      <Select
        id={group.name}
        backgroundColor="blue"
        name="tag-select"
        isMulti={true}
        label={group.name}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        placeholder={formatMessage(
          causeAndConsequences.shared.selectPlaceholder,
        )}
        isClearable={false}
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
              group.code.substring(0, majorGroupLength),
              true,
              meta.option?.value || '',
            )
          } else if (meta.action === 'remove-value') {
            onChange(
              [meta.removedValue] as Option[],
              group.code.substring(0, majorGroupLength),
              false,
              meta.removedValue?.value,
            )
          } else if (meta.action === 'deselect-option') {
            onChange(
              [meta.option] as Option[],
              group.code.substring(0, majorGroupLength),
              false,
              meta.option?.value || '',
            )
          }
        }}
      />
    </Box>
  )
}
