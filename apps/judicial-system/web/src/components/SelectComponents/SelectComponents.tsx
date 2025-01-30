import {
  ClearIndicatorProps,
  components,
  DropdownIndicatorProps,
  OptionProps,
  PlaceholderProps,
  SingleValueProps,
} from 'react-select'

import { Icon, Text } from '@island.is/island-ui/core'

import { ReactSelectOption } from '../../types'

export const ClearIndicator = (
  props: ClearIndicatorProps<ReactSelectOption>,
) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon icon="close" color="blue400" />
    </components.ClearIndicator>
  )
}

export const DropdownIndicator = (
  props: DropdownIndicatorProps<ReactSelectOption>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon type="filled" icon="chevronDown" color="blue400" />
    </components.DropdownIndicator>
  )
}

export const Placeholder = (props: PlaceholderProps<ReactSelectOption>) => {
  return (
    <components.Placeholder {...props}>
      <Text color="dark300" variant="small">
        {props.children}
      </Text>
    </components.Placeholder>
  )
}

export const SingleValue = (props: SingleValueProps<ReactSelectOption>) => {
  return (
    <components.SingleValue {...props}>
      <Text variant="small">{props.children}</Text>
    </components.SingleValue>
  )
}

export const Option = (props: OptionProps<ReactSelectOption>) => {
  return (
    <components.Option {...props}>
      <Text variant="small">{props.children}</Text>
    </components.Option>
  )
}
