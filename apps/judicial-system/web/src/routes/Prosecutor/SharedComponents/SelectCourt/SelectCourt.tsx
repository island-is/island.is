import React from 'react'
import { Box, Select, Text } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import type { Case, Institution } from '@island.is/judicial-system/types'
import { ValueType } from 'react-select'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  courts: Institution[]
}

const SelectCourt: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, courts } = props
  const { updateCase } = useCase()

  const selectCourts = courts.map((court) => ({
    label: court.name,
    value: court.id,
  }))

  const defaultCourt = selectCourts.find(
    (court) => court.label === workingCase.court?.name,
  )

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          Dómstóll
        </Text>
      </Box>
      <Select
        name="court"
        label="Veldu dómstól"
        defaultValue={defaultCourt}
        options={selectCourts}
        onChange={(selectedOption: ValueType<ReactSelectOption>) =>
          setAndSendToServer(
            'courtId',
            (selectedOption as ReactSelectOption).value as string,
            workingCase,
            setWorkingCase,
            updateCase,
          )
        }
        required
      />
    </>
  )
}

export default SelectCourt
