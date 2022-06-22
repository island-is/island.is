import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Select, Text, Option } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import type { Case, Institution } from '@island.is/judicial-system/types'
import { selectCourt as m } from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
  courts: Institution[]
  onChange: (courtId: string) => boolean
}

const SelectCourt: React.FC<Props> = (props) => {
  const { workingCase, courts, onChange } = props

  const { formatMessage } = useIntl()

  const [selectedCourt, setSelectedCourt] = useState<ValueType<Option>>(
    workingCase.court
      ? {
          label: workingCase.court.name,
          value: workingCase.court.id,
        }
      : null,
  )

  const selectCourts = courts.map((court) => ({
    label: court.name,
    value: court.id,
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
          onChange((selectedOption as ReactSelectOption).value as string) &&
            setSelectedCourt(selectedOption)
        }}
        required
      />
    </>
  )
}

export default SelectCourt
