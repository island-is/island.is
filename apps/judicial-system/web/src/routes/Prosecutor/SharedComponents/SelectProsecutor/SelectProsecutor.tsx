import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Select, Tooltip } from '@island.is/island-ui/core'
import { Case, User } from '@island.is/judicial-system/types'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { strings } from './SelectProsecutor.strings'

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
      <SectionHeading
        title={`${formatMessage(strings.heading)} `}
        tooltip={
          <Box component="span" data-testid="prosecutor-tooltip">
            <Tooltip text={formatMessage(strings.tooltip)} />
          </Box>
        }
      />
      <Select
        name="prosecutor"
        label={formatMessage(strings.label)}
        placeholder={formatMessage(strings.placeholder)}
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
