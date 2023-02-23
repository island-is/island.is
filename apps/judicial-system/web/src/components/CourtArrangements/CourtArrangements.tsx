import React, { useEffect, useState } from 'react'
import compareAsc from 'date-fns/compareAsc'

import { Box, Input } from '@island.is/island-ui/core'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import BlueBox from '../BlueBox/BlueBox'
import DateTime from '../DateTime/DateTime'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import { useCase } from '../../utils/hooks'
import { formatDateForServer } from '../../utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  handleCourtDateChange: (date: Date | undefined, valid: boolean) => void
  selectedCourtDate?: string
}

export const useCourtArrangements = (workingCase: Case) => {
  const [courtDate, setCourtDate] = useState<string>()
  const [courtDateHasChanged, setCourtDateHasChanged] = useState(false)

  useEffect(() => {
    if (workingCase.courtDate) {
      setCourtDate(workingCase.courtDate)
    }
  }, [workingCase.courtDate])

  const handleCourtDateChange = (date: Date | undefined, valid: boolean) => {
    if (date && valid) {
      if (
        workingCase.courtDate &&
        compareAsc(date, new Date(workingCase.courtDate)) !== 0
      ) {
        setCourtDateHasChanged(true)
      }

      setCourtDate(formatDateForServer(date))
    }
  }

  return {
    courtDate,
    setCourtDate,
    courtDateHasChanged,
    handleCourtDateChange,
  }
}

export const CourtArrangements: React.FC<Props> = (props) => {
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
