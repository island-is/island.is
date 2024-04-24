import React, { useEffect, useState } from 'react'
import compareAsc from 'date-fns/compareAsc'

import { Box, Input } from '@island.is/island-ui/core'
import { getLatestDateType } from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
} from '@island.is/judicial-system-web/src/components'
import {
  DateLog,
  DateType,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { validateAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'

interface Props {
  workingCase: Case
  handleCourtDateChange: (date: Date | undefined, valid: boolean) => void
  handleCourtRoomChange: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void
  selectedCourtDate?: string | null
  selectedCourtRoom?: string | null
  blueBox?: boolean
  dateTimeDisabled?: boolean
  courtRoomDisabled?: boolean
}

export const useCourtArrangements = (workingCase: Case) => {
  const [courtDate, setCourtDate] = useState<string | null>()
  const [courtDateHasChanged, setCourtDateHasChanged] = useState(false)
  const { updateCase } = useCase()
  const latestCourtDate = getLatestDateType(
    [DateType.COURT_DATE],
    workingCase.dateLogs,
  ) as DateLog

  useEffect(() => {
    if (latestCourtDate) {
      setCourtDate(latestCourtDate.date)
    }
  }, [latestCourtDate])

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

  const handleCourtRoomChange = (courtRoom: string) => {
    validateAndSendToServer('courtRoom', courtRoom, [], workingCase, updateCase)
  }

  return {
    courtDate,
    setCourtDate,
    courtDateHasChanged,
    handleCourtDateChange,
    handleCourtRoomChange,
  }
}

export const CourtArrangements: React.FC<Props> = (props) => {
  const {
    workingCase,
    handleCourtDateChange,
    handleCourtRoomChange,
    selectedCourtDate,
    selectedCourtRoom,
    blueBox = true,
    dateTimeDisabled,
    courtRoomDisabled,
  } = props
  const { updateCase } = useCase()
  const [courtRoomValue, setCourtRoomValue] = useState<string>()

  const isCorrectingRuling = workingCase.notifications?.some(
    (notification) => notification.type === NotificationType.RULING,
  )

  useEffect(() => {
    if (selectedCourtRoom) {
      setCourtRoomValue(selectedCourtRoom)
    }
  }, [selectedCourtRoom])

  const renderCourtArrangements = () => (
    <>
      <Box marginBottom={2}>
        <DateTime
          name="courtDate"
          selectedDate={selectedCourtDate}
          minDate={new Date()}
          onChange={handleCourtDateChange}
          blueBox={false}
          required
          disabled={isCorrectingRuling || dateTimeDisabled}
        />
      </Box>
      <Input
        data-testid="courtroom"
        name="courtroom"
        label="Dómsalur"
        autoComplete="off"
        value={courtRoomValue}
        placeholder="Skráðu inn dómsal"
        onChange={(evt) => {
          setCourtRoomValue(evt.target.value)
        }}
        onBlur={(evt) => {
          if (handleCourtRoomChange) {
            handleCourtRoomChange(evt)
          } else {
            validateAndSendToServer(
              'courtRoom',
              evt.target.value,
              [],
              workingCase,
              updateCase,
            )
          }
        }}
        disabled={isCorrectingRuling || courtRoomDisabled}
      />
    </>
  )

  return blueBox ? (
    <BlueBox>{renderCourtArrangements()}</BlueBox>
  ) : (
    renderCourtArrangements()
  )
}
