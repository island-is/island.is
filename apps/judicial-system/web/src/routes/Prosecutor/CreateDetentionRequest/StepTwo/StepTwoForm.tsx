import React, { useState } from 'react'
import { Case } from '@island.is/judicial-system/types'
import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import {
  newSetAndSendDateToServer,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { ValueType } from 'react-select'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  defaultProsecutor: ReactSelectOption
  courts: ReactSelectOption[]
  defaultCourt: ReactSelectOption[]
}

const StepTwoForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    prosecutors,
    defaultProsecutor,
    courts,
    defaultCourt,
  } = props

  const [arrestDateIsValid, setArrestDateIsValid] = useState(true)

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
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Dómstóll
          </Text>
        </Box>
        <Select
          name="court"
          label="Veldu dómstól"
          defaultValue={{
            label:
              defaultCourt.length > 0 ? defaultCourt[0].label : courts[0].label,
            value:
              defaultCourt.length > 0 ? defaultCourt[0].value : courts[0].value,
          }}
          options={courts}
          onChange={(selectedOption: ValueType<ReactSelectOption>) =>
            setAndSendToServer(
              'court',
              (selectedOption as ReactSelectOption).label,
              workingCase,
              setWorkingCase,
              updateCase,
            )
          }
        />
      </Box>
      {!workingCase.parentCase && (
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Tími handtöku
            </Text>
          </Box>
          <DateTime
            name="arrestDate"
            selectedDate={
              workingCase.arrestDate
                ? new Date(workingCase.arrestDate)
                : undefined
            }
            onChange={(date: Date | undefined, valid: boolean) => {
              newSetAndSendDateToServer(
                'arrestDate',
                date,
                valid,
                workingCase,
                setWorkingCase,
                setArrestDateIsValid,
                updateCase,
              )
            }}
          />
        </Box>
      )}
    </>
  )
}

export default StepTwoForm
