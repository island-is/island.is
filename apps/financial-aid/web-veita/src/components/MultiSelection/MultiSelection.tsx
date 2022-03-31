import React, { ReactNode } from 'react'
import { Text, Box, Icon, Option } from '@island.is/island-ui/core'
import CreatableReactSelect from 'react-select/creatable'
import * as styles from './MultiSelection.css'

import cn from 'classnames'
import { components } from 'react-select'

export const DropdownIndicator = () => {
  return (
    <components.DropdownIndicator className="">
      <Icon icon={icon} size="large" color={'blue400'} />
    </components.DropdownIndicator>
  )
}

interface Props {
  options: Option[]
}

const MultiSelection = ({ options }: Props) => {
  return (
    <Box className={styles.selectContainer}>
      <CreatableReactSelect
        closeMenuOnSelect={false}
        isMulti={true}
        options={options}
        className={styles.select}
        components={{
          DropdownIndicator,
        }}
        // icon={<Icon name="chevronDown" />}
      ></CreatableReactSelect>
    </Box>
  )
}

export default MultiSelection
