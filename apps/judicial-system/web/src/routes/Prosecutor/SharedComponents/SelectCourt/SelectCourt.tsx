import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Option, Select, Text } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import type { Case, Institution } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { selectCourt as m } from '@island.is/judicial-system-web/messages/Core/selectCourt'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  setSelectedCourt: React.Dispatch<React.SetStateAction<Option | undefined>>
  courts: ReactSelectOption[]
  defaultCourt?: ReactSelectOption
}

const SelectCourt: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    setSelectedCourt,
    courts,
    defaultCourt,
  } = props

  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

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
        options={courts}
        onChange={(selectedOption: ValueType<ReactSelectOption>) => {
          setAndSendToServer(
            'courtId',
            (selectedOption as ReactSelectOption).value as string,
            workingCase,
            setWorkingCase,
            updateCase,
          )

          setSelectedCourt(selectedOption as ReactSelectOption)
        }}
        required
      />
    </>
  )
}

export default SelectCourt
