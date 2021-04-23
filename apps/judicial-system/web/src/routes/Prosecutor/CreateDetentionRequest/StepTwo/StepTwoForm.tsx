import React, { useState } from 'react'
import { Case } from '@island.is/judicial-system/types'
import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { ValueType } from 'react-select'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  defaultProsecutor: ReactSelectOption
}

const StepTwoForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, prosecutors, defaultProsecutor } = props
  const { updateCase } = useCase()

  return (
    <>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Óskir um fyrirtöku
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Ákærandi{' '}
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
          onChange={(selectedOption: ValueType<ReactSelectOption>) =>
            setAndSendToServer(
              'prosecutorId',
              (selectedOption as ReactSelectOption).value.toString(),
              workingCase,
              setWorkingCase,
              updateCase,
            )
          }
          required
        />
      </Box>
    </>
  )
}

export default StepTwoForm
