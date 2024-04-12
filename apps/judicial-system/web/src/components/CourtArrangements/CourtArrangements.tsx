import React, { useEffect, useState } from 'react'
import compareAsc from 'date-fns/compareAsc'

import { Box, Input } from '@island.is/island-ui/core'
import { getLatestDateTypeByCaseId } from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
} from '@island.is/judicial-system-web/src/components'
import {
  DateType,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  handleCourtDateChange: (date: Date | undefined, valid: boolean) => void
  selectedCourtDate?: string | null
}

export const useCourtArrangements = (workingCase: Case) => {
  const [courtDate, setCourtDate] = useState<string | null>()
  const [courtDateHasChanged, setCourtDateHasChanged] = useState(false)
  const latestCourtDate = getLatestDateTypeByCaseId(
    DateType.COURT_DATE,
    workingCase.id,
    workingCase.dateLogs,
  )

  useEffect(() => {
    if (latestCourtDate) {
      setCourtDate(latestCourtDate.date)
    }
  }, [latestCourtDate, workingCase.dateLogs, workingCase.id])

  const handleCourtDateChange = (date: Date | undefined, valid: boolean) => {
    if (date && valid) {
      if (
        latestCourtDate &&
        latestCourtDate.date &&
        compareAsc(date, new Date(latestCourtDate.date)) !== 0 &&
        hasSentNotification(
          NotificationType.COURT_DATE,
          workingCase.notifications,
        ).hasSent
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
