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

export const ClearIndicator = <T extends ReactSelectOption>(
  props: ClearIndicatorProps<T>,
) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon icon="close" color="blue400" />
    </components.ClearIndicator>
  )
}

export const DropdownIndicator = <T extends ReactSelectOption>(
  props: DropdownIndicatorProps<T>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon type="filled" icon="chevronDown" color="blue400" />
    </components.DropdownIndicator>
  )
}

export const Placeholder = <T extends ReactSelectOption>(
  props: PlaceholderProps<T>,
) => {
  return (
    <components.Placeholder {...props}>
      <Text color="dark300" variant="small">
        {props.children}
      </Text>
    </components.Placeholder>
  )
}

export const SingleValue = <T extends ReactSelectOption>(
  props: SingleValueProps<T>,
) => {
  return (
    <components.SingleValue {...props}>
      <Text variant="small">{props.children}</Text>
    </components.SingleValue>
  )
}

export const Option = <T extends ReactSelectOption>(props: OptionProps<T>) => {
  return (
    <components.Option {...props}>
      <Text variant="small">{props.children}</Text>
    </components.Option>
  )
}
