import React, { useEffect, useState } from 'react'
import { Select, Box } from '@island.is/island-ui/core'
import { Municipality } from '@island.is/financial-aid/shared/lib'
import { isString } from 'lodash'

interface Props {
  municipality: Municipality[]
  currentMunicipality: Municipality
  setCurrentMunicipality: React.Dispatch<React.SetStateAction<Municipality>>
}
export const SelectedMunicipality = ({
  municipality,
  currentMunicipality,
  setCurrentMunicipality,
}: Props) => {
  const [state, setState] = useState<any>(
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
        onChange={(selected: any) => {
          if ((selected?.value as unknown) && isString(selected?.value)) {
            setCurrentMunicipality(
              municipality.find((el) => el.municipalityId === selected?.value),
            )
          }
        }}
      />
    </Box>
  )
}

export default SelectedMunicipality
