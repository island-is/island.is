import React, { useEffect, useState } from 'react'
import { Select, Box } from '@island.is/island-ui/core'
import { Municipality } from '@island.is/financial-aid/shared/lib'
import { isString } from 'lodash'
import { ReactSelectOption } from '@island.is/financial-aid/shared/lib'
import { ValueType } from 'react-select'

interface Props {
  municipality: Municipality[]
  currentMunicipality: Municipality
  setCurrentMunicipality: React.Dispatch<
    React.SetStateAction<Municipality | undefined>
  >
}
export const SelectedMunicipality = ({
  municipality,
  currentMunicipality,
  setCurrentMunicipality,
}: Props) => {
  const [state, setState] = useState<ReactSelectOption[]>(
    municipality
      .filter((el) => el !== currentMunicipality)
      .map((el) => {
        return { label: el.name, value: el.municipalityId }
      }),
  )

  return (
    <Box>
      <Select
        label="Sveitarfélög"
        name="selectMunicipality"
        noOptionsMessage="Enginn valmöguleiki"
        defaultValue={{
          label: currentMunicipality.name,
          value: currentMunicipality.municipalityId,
        }}
        options={state}
        onChange={(selected: ValueType<ReactSelectOption>) => {
          const { value } = selected as ReactSelectOption
          if (value && isString(value)) {
            console.log(
              value,
              municipality.find((el) => el.municipalityId === value),
            )
            setCurrentMunicipality(
              municipality.find((el) => el.municipalityId === value),
            )
          }
        }}
      />
    </Box>
  )
}

export default SelectedMunicipality
