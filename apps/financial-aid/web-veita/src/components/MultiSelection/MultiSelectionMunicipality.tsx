import React, { useContext, useEffect } from 'react'
import { Box, Select, Text, Icon } from '@island.is/island-ui/core'
import {
  ReactSelectOption,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'
import { isString } from 'lodash'
import { ValueType } from 'react-select'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

import * as styles from './MultiSelection.css'

export type CreateUpdateStaff<T> = {
  hasError: boolean
  roles: StaffRole[]
  municipalityIds: string[]
} & T

export type selectionType = 'add' | 'remove'

type Props<T> = {
  selectionUpdate: (value: string, label: string, type: selectionType) => void
  state: CreateUpdateStaff<T>
}

const MultiSelectionMunicipality = <T extends unknown>({
  selectionUpdate,
  state,
}: Props<T>) => {
  const { municipality } = useContext(AdminContext)

  useEffect(() => {
    if (municipality && municipality.length === 1) {
      selectionUpdate(
        municipality[0].municipalityId,
        municipality[0].name,
        'add',
      )
    }
  }, [municipality])

  if (municipality.length === 1) {
    return <></>
  }

  const { municipalityIds, hasError } = state

  const mapMuniToOption = (filterArr: string[], active: boolean) => {
    const { municipality } = useContext(AdminContext)

    return municipality
      .filter((el) =>
        active
          ? filterArr.includes(el.municipalityId)
          : !filterArr.includes(el.municipalityId),
      )
      .map((el) => {
        return { label: el.name, value: el.municipalityId }
      })
  }

  return (
    <Box display="block">
      <Text
        fontWeight="semiBold"
        color="dark300"
        variant="small"
        marginBottom={2}
      >
        Sveitarfélög notanda
      </Text>
      <Box marginBottom={2}>
        {mapMuniToOption(municipalityIds, true).map((muni, index) => {
          return (
            <button
              key={'muni-tags-' + index}
              className={styles.tags}
              onClick={() => {
                selectionUpdate(muni.value, muni.label, 'remove')
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
          const { value, label } = option as ReactSelectOption
          if (value && isString(value) && label) {
            selectionUpdate(value, label, 'add')
          }
        }}
        backgroundColor="blue"
        errorMessage="Verður að velja að minnsta kosti 1 sveitarfélag"
        hasError={hasError && municipalityIds.length === 0}
      />
    </Box>
  )
}

export default MultiSelectionMunicipality
