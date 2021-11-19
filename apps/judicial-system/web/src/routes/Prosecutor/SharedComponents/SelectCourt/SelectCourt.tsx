import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Option, Select, Text } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import type { Case } from '@island.is/judicial-system/types'
import { selectCourt as m } from '@island.is/judicial-system-web/messages/Core/selectCourt'

interface Props {
  workingCase: Case
  courts: ReactSelectOption[]
  onChange: (selectedOption: ReactSelectOption) => boolean
}

const SelectCourt: React.FC<Props> = (props) => {
  const { workingCase, courts, onChange } = props
  const [selectedCourt, setSelectedCourt] = useState<Option>()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (workingCase.court) {
      setSelectedCourt({
        label: workingCase.court.name || '',
        value: workingCase.court.id || '',
      })
    }
  }, [workingCase.court])

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
        options={courts}
        onChange={(selectedOption) => {
          onChange(selectedOption as ReactSelectOption) &&
            setSelectedCourt(selectedOption as ReactSelectOption)
        }}
        required
      />
    </>
  )
}

export default SelectCourt
