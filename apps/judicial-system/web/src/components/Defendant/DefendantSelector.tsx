import { FC, useState } from 'react'

import { Select } from '@island.is/island-ui/core'

import { Defendant, Maybe } from '../../graphql/schema'
import SectionHeading from '../SectionHeading/SectionHeading'

interface DefendantSelectorProps {
  defendants: Maybe<Defendant[]> | undefined
}

const DefendantSelector: FC<DefendantSelectorProps> = (props) => {
  const { defendants } = props
  const [selectedDefendant, setSelectedDefendant] = useState<Defendant | null>(
    null,
  )

  return (
    <>
      <SectionHeading title="Hvern á að kljúfa frá málinu?" />
      <Select
        name="defendant"
        options={defendants?.map((defendant) => ({
          label: defendant.name ?? 'Nafn ekki skráð',
          value: defendant.id,
        }))}
        label="Ákærði"
        placeholder="Veldu ákærða"
        value={
          selectedDefendant
            ? {
                label: selectedDefendant.name ?? 'Nafn ekki skráð',
                value: selectedDefendant.id,
              }
            : null
        }
        onChange={(option) => {
          const defendant = defendants?.find(
            (defendant) => defendant.id === option?.value,
          )
          setSelectedDefendant(defendant ?? null)
        }}
        noOptionsMessage="Enginn ákærði er skráður í málinu"
        isClearable
      />
    </>
  )
}

export default DefendantSelector
