import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { Case } from '@island.is/judicial-system/types'
import { Option } from '@island.is/island-ui/core'
import { selectProsecutor as m } from '@island.is/judicial-system-web/messages/Core/selectProsecutor'

interface Props {
  workingCase: Case
  prosecutors: ReactSelectOption[]
  onChange: (selectedOption: ReactSelectOption) => boolean
}

const SelectProsecutor: React.FC<Props> = (props) => {
  const { workingCase, prosecutors, onChange } = props
  const [selectedProsecutor, setSelectedProsecutor] = useState<Option>()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (workingCase.prosecutor) {
      setSelectedProsecutor({
        label: workingCase.prosecutor.name || '',
        value: workingCase.prosecutor.id || '',
      })
    }
  }, [workingCase.prosecutor])

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {`${formatMessage(m.heading)} `}
          <Box component="span" data-testid="prosecutor-tooltip">
            <Tooltip text={formatMessage(m.tooltip)} />
          </Box>
        </Text>
      </Box>
      <Select
        name="prosecutor"
        label={formatMessage(m.label)}
        value={selectedProsecutor}
        options={prosecutors}
        onChange={(selectedOption) => {
          onChange(selectedOption as ReactSelectOption) &&
            setSelectedProsecutor(selectedOption as ReactSelectOption)
        }}
        required
      />
    </>
  )
}

export default SelectProsecutor
