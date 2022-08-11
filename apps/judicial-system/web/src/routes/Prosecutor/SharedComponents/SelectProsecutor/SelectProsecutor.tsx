import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { Case, User } from '@island.is/judicial-system/types'
import { selectProsecutor as m } from '@island.is/judicial-system-web/messages'

type ProsecutorSelectOption = ReactSelectOption & { prosecutor: User }

interface Props {
  workingCase: Case
  prosecutors: User[]
  onChange: (prosecutor: User) => boolean
}

const SelectProsecutor: React.FC<Props> = (props) => {
  const { workingCase, prosecutors, onChange } = props

  const { formatMessage } = useIntl()

  const [selectedProsecutor, setSelectedProsecutor] = useState<
    ValueType<ProsecutorSelectOption>
  >(
    workingCase.prosecutor
      ? {
          label: workingCase.prosecutor.name,
          value: workingCase.prosecutor.id,
          prosecutor: workingCase.prosecutor,
        }
      : null,
  )

  const selectProsecutors: ProsecutorSelectOption[] = prosecutors.map(
    (prosecutor) => ({
      label: prosecutor.name,
      value: prosecutor.id,
      prosecutor,
    }),
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
        options={selectProsecutors}
        onChange={(selectedOption: ValueType<ReactSelectOption>) => {
          onChange((selectedOption as ProsecutorSelectOption).prosecutor) &&
            setSelectedProsecutor(selectedOption as ProsecutorSelectOption)
        }}
        required
      />
    </>
  )
}

export default SelectProsecutor
