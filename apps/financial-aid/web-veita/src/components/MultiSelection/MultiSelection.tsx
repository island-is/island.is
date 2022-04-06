import React from 'react'
import { Box, Option, Select, Text, Icon } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/financial-aid/shared/lib'
import { newUsersModalState } from '../NewUserModal/NewUserModal'
import { EmployeeProfileInfo } from '../Profile/EmployeeProfile'
import { isString } from 'lodash'
import { ValueType } from 'react-select'
import * as styles from './MultiSelection.css'

interface Props {
  options: Option[]
  active: Option[]
  onSelected: (value: ValueType<ReactSelectOption>) => void
  unSelected: (value: string, name: string) => void
  setState:
    | React.Dispatch<React.SetStateAction<newUsersModalState>>
    | React.Dispatch<React.SetStateAction<EmployeeProfileInfo>>
  state: newUsersModalState | EmployeeProfileInfo
  hasError: boolean
  // | Pick<EmployeeProfileInfo, 'municipalityIds' | 'serviceCenter'>
}

const MultiSelection = ({
  options,
  active,
  onSelected,
  unSelected,
  setState,
  state,
  hasError,
}: Props) => {
  return (
    <Box display="block">
      <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
        Sveitarfélög notanda
      </Text>
      <Box marginBottom={2}>
        {active.map((muni, index) => {
          return (
            <button
              key={'muni-tags-' + index}
              className={styles.tags}
              onClick={() => unSelected(muni.value as string, muni.label)}
            >
              <Box display="flex" alignItems="center" padding={1}>
                <Box marginRight={1}>
                  <Text color="blue400" fontWeight="semiBold" variant="small">
                    {muni.label}
                  </Text>
                </Box>

                <Icon icon="close" color="blue300" size="small" />
              </Box>
            </button>
          )
        })}
      </Box>

      <Select
        label="Sveitarfélög"
        name="selectMunicipality"
        noOptionsMessage="Enginn valmöguleiki"
        options={options}
        placeholder="Veldu tegund"
        onChange={onSelected}
        backgroundColor="blue"
        errorMessage="Verður að haka við sveitarfélag"
        hasError={hasError}
      />
    </Box>
  )
}

export default MultiSelection
