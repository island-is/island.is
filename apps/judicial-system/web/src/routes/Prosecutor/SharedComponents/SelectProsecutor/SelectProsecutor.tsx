import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { Case } from '@island.is/judicial-system/types'
import { Option } from '@island.is/island-ui/core'
import { selectProsecutor as m } from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
  prosecutors: ReactSelectOption[]
  onChange: (selectedOption: ValueType<ReactSelectOption>) => boolean
}

const SelectProsecutor: React.FC<Props> = (props) => {
  const { workingCase, prosecutors, onChange } = props
  const { formatMessage } = useIntl()
  const [selectedProsecutor, setSelectedProsecutor] = useState<
    ValueType<Option>
  >(
    workingCase.prosecutor
      ? {
          label: workingCase.prosecutor.name,
          value: workingCase.prosecutor.id,
        }
      : null,
  )

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
        placeholder={formatMessage(m.placeholder)}
        value={selectedProsecutor}
        options={prosecutors}
        onChange={(selectedOption) => {
          onChange(selectedOption) && setSelectedProsecutor(selectedOption)
        }}
        required
      />
    </>
  )
}

export default SelectProsecutor
