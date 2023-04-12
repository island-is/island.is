import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Select, Text } from '@island.is/island-ui/core'
import {
  TempCase as Case,
  ReactSelectOption,
} from '@island.is/judicial-system-web/src/types'
import { selectCourt as m } from '@island.is/judicial-system-web/messages'
import { Institution } from '@island.is/judicial-system-web/src/graphql/schema'

type CourtSelectOption = ReactSelectOption & { court: Institution }

interface Props {
  workingCase: Case
  courts: Institution[]
  onChange: (court: Institution) => boolean
}

const SelectCourt: React.FC<Props> = (props) => {
  const { workingCase, courts, onChange } = props

  const { formatMessage } = useIntl()

  const [selectedCourt, setSelectedCourt] = useState<
    ValueType<CourtSelectOption>
  >(
    workingCase.court
      ? {
          label: workingCase.court.name,
          value: workingCase.court.id,
          court: workingCase.court,
        }
      : null,
  )

  const selectCourts: CourtSelectOption[] = courts.map((court) => ({
    label: court.name,
    value: court.id,
    court,
  }))

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {formatMessage(m.title)}
        </Text>
      </Box>
      <Select
        name="court"
        label={formatMessage(m.label)}
        placeholder={formatMessage(m.placeholder)}
        value={selectedCourt}
        options={selectCourts}
        onChange={(selectedOption: ValueType<ReactSelectOption>) => {
          onChange((selectedOption as CourtSelectOption).court) &&
            setSelectedCourt(selectedOption as CourtSelectOption)
        }}
        required
      />
    </>
  )
}

export default SelectCourt
