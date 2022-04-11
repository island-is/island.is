import React, { useContext } from 'react'
import { Select } from '@island.is/island-ui/core'
import { Municipality } from '@island.is/financial-aid/shared/lib'
import { ReactSelectOption } from '@island.is/financial-aid/shared/lib'
import { ValueType } from 'react-select'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
interface Props {
  currentMunicipality: Municipality
  onStateUpdate: (muni: Municipality) => void
}
export const SelectedMunicipality = ({
  currentMunicipality,
  onStateUpdate,
}: Props) => {
  const { municipality } = useContext(AdminContext)
  return (
    <Select
      label="Sveitarfélög"
      name="selectMunicipality"
      noOptionsMessage="Enginn valmöguleiki"
      backgroundColor="blue"
      defaultValue={{
        label: currentMunicipality.name,
        value: currentMunicipality.municipalityId,
      }}
      options={municipality
        .filter(
          (el) => el.municipalityId !== currentMunicipality.municipalityId,
        )
        .map((el) => {
          return { label: el.name, value: el.municipalityId }
        })}
      onChange={(selected: ValueType<ReactSelectOption>) => {
        const { value } = selected as ReactSelectOption
        const findMuni = municipality.find((el) => el.municipalityId === value)
        if (findMuni) {
          onStateUpdate(findMuni)
        }
      }}
    />
  )
}

export default SelectedMunicipality
