import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select, Text } from '@island.is/island-ui/core'
import { selectCourt as m } from '@island.is/judicial-system-web/messages'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { Institution } from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'

type CourtSelectOption = ReactSelectOption & { court: Institution }

const SelectCourt: React.FC = () => {
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()
  const { districtCourts } = useInstitution()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const selectCourts: CourtSelectOption[] = districtCourts.map((court) => ({
    label: court.name ?? '',
    value: court.id,
    court,
  }))

  const defaultCourt = selectCourts.find(
    (court) => court.value === workingCase.court?.id,
  )

  const handleChange = async (courtId: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        courtId,
      })

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        court: updatedCase?.court,
      }))
    }
  }

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
        value={defaultCourt}
        options={selectCourts}
        onChange={(selectedOption) => {
          handleChange((selectedOption as CourtSelectOption).court.id)
        }}
        required
      />
    </>
  )
}

export default SelectCourt
