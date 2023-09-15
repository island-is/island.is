import React, { useEffect, useState } from 'react'
import compareAsc from 'date-fns/compareAsc'

import { Box, Input } from '@island.is/island-ui/core'
import { NotificationType } from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import { useCase } from '../../utils/hooks'
import { formatDateForServer } from '../../utils/hooks/useCase'
import { hasSentNotification } from '../../utils/stepHelper'
import BlueBox from '../BlueBox/BlueBox'
import DateTime from '../DateTime/DateTime'

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
        compareAsc(date, new Date(workingCase.courtDate)) !== 0 &&
        hasSentNotification(
          NotificationType.COURT_DATE,
          workingCase.notifications,
        )
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

export const CourtArrangements: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const {
    workingCase,
    setWorkingCase,
    handleCourtDateChange,
    selectedCourtDate,
  } = props
  const { updateCase } = useCase()

  const isCorrectingRuling = workingCase.notifications?.some(
    (notification) => notification.type === NotificationType.RULING,
  )

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
          disabled={isCorrectingRuling}
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
        disabled={isCorrectingRuling}
      />
    </BlueBox>
  )
}
