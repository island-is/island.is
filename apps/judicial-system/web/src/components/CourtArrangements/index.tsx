import React from 'react'

import { Box, Input } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'

import BlueBox from '../BlueBox/BlueBox'
import DateTime from '../DateTime/DateTime'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import { useCase } from '../../utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  handleCourtDateChange: (date: Date | undefined, valid: boolean) => void
  selectedCourtDate?: string
}
const CourtArrangements: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    handleCourtDateChange,
    selectedCourtDate,
  } = props
  const { updateCase } = useCase()

  return (
    <BlueBox>
      <Box marginBottom={2}>
        <DateTime
          name="courtDate"
          selectedDate={selectedCourtDate}
          minDate={new Date()}
          onChange={handleCourtDateChange}
          blueBox={false}
          required
        />
      </Box>
      <Input
        data-testid="courtroom"
        name="courtroom"
        label="Dómsalur"
        autoComplete="off"
        value={workingCase.courtRoom || ''}
        placeholder="Skráðu inn dómsal"
        onChange={(event) =>
          removeTabsValidateAndSet(
            'courtRoom',
            event.target.value,
            [],
            workingCase,
            setWorkingCase,
          )
        }
        onBlur={(event) =>
          validateAndSendToServer(
            'courtRoom',
            event.target.value,
            [],
            workingCase,
            updateCase,
          )
        }
      />
    </BlueBox>
  )
}

export default CourtArrangements
