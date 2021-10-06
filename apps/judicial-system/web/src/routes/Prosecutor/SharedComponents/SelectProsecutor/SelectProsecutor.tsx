import React from 'react'
import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import type { Case } from '@island.is/judicial-system/types'
import { ValueType } from 'react-select'
import { Option } from '@island.is/island-ui/core'

interface Props {
  workingCase: Case
  prosecutors: ReactSelectOption[]
  onChange: (selectedOption: ValueType<ReactSelectOption>) => void
}

const SelectProsecutor: React.FC<Props> = (props) => {
  const { workingCase, prosecutors, onChange } = props

  const defaultProsecutor = prosecutors?.find(
    (prosecutor: Option) => prosecutor.value === workingCase.prosecutor?.id,
  )

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {`Ákærandi `}
          <Box component="span" data-testid="prosecutor-tooltip">
            <Tooltip text="Sá saksóknari sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis." />
          </Box>
        </Text>
      </Box>
      <Select
        name="prosecutor"
        label="Veldu saksóknara"
        defaultValue={defaultProsecutor}
        options={prosecutors}
        onChange={(selectedOption: ValueType<ReactSelectOption>) => {
          onChange(selectedOption)
        }}
        required
      />
    </>
  )
}

export default SelectProsecutor
