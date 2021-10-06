import React, { useState } from 'react'
import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { Case, isRestrictionCase, User } from '@island.is/judicial-system/types'
import { ValueType } from 'react-select'
import { Option } from '@island.is/island-ui/core'

interface Props {
  workingCase: Case
  prosecutors: ReactSelectOption[]
  onChange: (selectedOption: ValueType<ReactSelectOption>) => void
  user?: User
}

const SelectProsecutor: React.FC<Props> = (props) => {
  const { workingCase, prosecutors, onChange, user } = props
  const [selectedProsecutor, setSelectedProsecutor] = useState<
    ValueType<Option>
  >({
    label: workingCase.prosecutor?.name || '',
    value: workingCase.prosecutor?.id || '',
  })

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
        value={selectedProsecutor}
        options={prosecutors}
        onChange={(selectedOption) => {
          onChange(selectedOption)

          if (
            isRestrictionCase(workingCase.type) ||
            user?.id === workingCase.creatingProsecutor?.id
          ) {
            setSelectedProsecutor(selectedOption)
          }
        }}
        required
      />
    </>
  )
}

export default SelectProsecutor
