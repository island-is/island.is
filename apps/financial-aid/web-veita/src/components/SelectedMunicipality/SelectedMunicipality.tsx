import React, { useEffect, useState } from 'react'
import { Select, Box } from '@island.is/island-ui/core'
import { Municipality } from '@island.is/financial-aid/shared/lib'

interface Props {
  municipality: Municipality[]
  currentMunicipality: Municipality
}
export const SelectedMunicipality = ({
  municipality,
  currentMunicipality,
}: Props) => {
  const [state, setState] = useState<any>(
    municipality.map((el) => {
      return { label: el.name, value: el.municipalityId }
    }),
  )
  console.log(currentMunicipality)
  return (
    <Box>
      {' '}
      <Select
        label="Sveitarfélög"
        name="selectMunicipality"
        noOptionsMessage="Enginn valmöguleiki"
        // defaultValue={municipality.find((el) => el === currentMunicipality)}
        options={state}
        placeholder={currentMunicipality.name as string}
        onChange={() => {}}
      />
    </Box>
  )
}

export default SelectedMunicipality
