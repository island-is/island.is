import React from 'react'
import { Box, Select, Text, Icon } from '@island.is/island-ui/core'
import {
  ReactSelectOption,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'
import { isString } from 'lodash'
import { ValueType } from 'react-select'
import { mapMuniToOption } from '@island.is/financial-aid-web/veita/src/utils/formHelper'

import * as styles from './MultiSelection.css'

export type CreateUpdateStaff<T> = {
  hasError: boolean
  roles: StaffRole[]
  municipalityIds: string[]
} & T

type Props<T> = {
  selectionUpdate: any
  state: CreateUpdateStaff<T>
  hasError: boolean
}

const MultiSelection = <T extends unknown>({
  selectionUpdate,
  state,
  hasError,
}: Props<T>) => {
  const { municipalityIds } = state

  return (
    <Box display="block">
      <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
        Sveitarfélög notanda
      </Text>
      <Box marginBottom={2}>
        {mapMuniToOption(municipalityIds, true).map((muni, index) => {
          return (
            <button
              key={'muni-tags-' + index}
              className={styles.tags}
              onClick={() => {
                selectionUpdate(muni.value, 'remove')
              }}
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
        options={mapMuniToOption(municipalityIds, false)}
        placeholder="Veldu tegund"
        onChange={(option: ValueType<ReactSelectOption>) => {
          const { value } = option as ReactSelectOption
          if (value && isString(value)) {
            selectionUpdate(value, 'add')
          }
        }}
        backgroundColor="blue"
        errorMessage="Verður að haka við sveitarfélag"
        hasError={hasError}
      />
    </Box>
  )
}

export default MultiSelection
