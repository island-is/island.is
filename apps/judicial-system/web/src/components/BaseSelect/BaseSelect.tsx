import { FC } from 'react'
import Select, {
  ActionMeta,
  MultiValue,
  PropsValue,
  SingleValue as ReactSelectSingleValue,
} from 'react-select'

import { Option as CoreOption } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { ReactSelectOption } from '../../types'
import {
  DropdownIndicator,
  Option,
  Placeholder,
  SingleValue,
} from '../SelectComponents/SelectComponents'

interface Props {
  options: ReactSelectOption[]
  isLoading: boolean
  placeholder?: string
  value?: PropsValue<CoreOption<string | number | null>>
  onChange?: (
    newValue:
      | MultiValue<ReactSelectOption>
      | ReactSelectSingleValue<ReactSelectOption>,
    actionMeta: ActionMeta<ReactSelectOption>,
  ) => void
}
const BaseSelect: FC<Props> = (props) => {
  const {
    options,
    isLoading,
    placeholder = 'Hver lagði fram?',
    value,
    onChange,
  } = props

  return (
    <Select
      classNamePrefix="court-documents-select"
      options={options}
      placeholder={placeholder}
      isLoading={isLoading}
      components={{
        DropdownIndicator,
        ClearIndicator: undefined,
        IndicatorSeparator: undefined,
        Placeholder,
        Option,
        SingleValue,
      }}
      styles={{
        control: (baseStyles, { menuIsOpen }) => ({
          ...baseStyles,
          border: 'none',
          cursor: 'pointer',
          boxShadow: menuIsOpen
            ? `inset 0 0 0 3px ${theme.color.mint400}`
            : `inset 0 0 0 1px ${theme.color.dark100}`,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: menuIsOpen ? 0 : 8,
          borderBottomRightRadius: menuIsOpen ? 0 : 8,
          transition: 'none',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          marginTop: -3,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: 'none',
          borderTop: `none`,
          borderRight: `3px solid ${theme.color.mint400}`,
          borderLeft: `3px solid ${theme.color.mint400}`,
          borderBottom: `3px solid ${theme.color.mint400}`,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          boxSizing: 'border-box',
        }),
        option: (baseStyles, { isSelected }) => ({
          ...baseStyles,
          cursor: 'pointer',
          position: 'relative',
          padding: `${theme.spacing[1]}px`,
          background: isSelected ? theme.color.blue200 : 'white',
          '&:hover': {
            background: isSelected ? theme.color.blue200 : theme.color.blue100,
          },
        }),
        container: (baseStyles) => ({
          ...baseStyles,
          width: '100%',
        }),
      }}
      value={value}
      onChange={onChange}
      isSearchable={false}
      isClearable
    />
  )
}

export default BaseSelect
