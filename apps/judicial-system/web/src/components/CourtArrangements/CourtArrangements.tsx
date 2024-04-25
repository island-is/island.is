import React, { useEffect, useState } from 'react'
import compareAsc from 'date-fns/compareAsc'

import { Box, Input } from '@island.is/island-ui/core'
import {
  BlueBox,
  DateTime,
} from '@island.is/judicial-system-web/src/components'
import { NotificationType } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  formatDateForServer,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'

interface CourtDate {
  date?: string | null
  location?: string | null
}

interface Props {
  workingCase: Case
  handleCourtDateChange: (date: Date | undefined | null, valid: boolean) => void
  handleCourtRoomChange: (courtRoom?: string) => void
  courtDate?: CourtDate | null
  blueBox?: boolean
  dateTimeDisabled?: boolean
  courtRoomDisabled?: boolean
}

export const useCourtArrangements = (
  workingCase: Case,
  setWorkingCase: (value: React.SetStateAction<Case>) => void,
  dateKey: keyof Pick<Case, 'arraignmentDate' | 'courtDate'>,
) => {
  const { setAndSendCaseToServer } = useCase()
  const [courtDate, setCourtDate] = useState<CourtDate | null>()
  const [courtDateHasChanged, setCourtDateHasChanged] = useState(false)

  useEffect(() => {
    if (workingCase[dateKey]) {
      setCourtDate(workingCase[dateKey])
    }
  }, [dateKey, workingCase])

  const handleCourtDateChange = (
    date: Date | undefined | null,
    valid = true,
  ) => {
    if (date && valid) {
      const oldDate = workingCase[dateKey]
      if (
        oldDate?.date &&
        compareAsc(date, new Date(oldDate.date)) !== 0 &&
        hasSentNotification(
          NotificationType.COURT_DATE,
          workingCase.notifications,
        ).hasSent
      ) {
        setCourtDateHasChanged(true)
      }

      setCourtDate((previous) =>
        previous
          ? { ...previous, date: formatDateForServer(date) }
          : { date: formatDateForServer(date) },
      )
    }
  }

  const handleCourtRoomChange = (courtRoom?: string) => {
    setCourtDate((previous) =>
      previous ? { ...previous, location: courtRoom } : { location: courtRoom },
    )
  }

  const sendCourtDateToServer = () => {
    return setAndSendCaseToServer(
      [
        {
          arraignmentDate: courtDate?.date
            ? {
                date: formatDateForServer(new Date(courtDate.date)),
                location: courtDate.location,
              }
            : undefined,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }

  return {
    courtDate,
    courtDateHasChanged,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  }
}

export const CourtArrangements: React.FC<Props> = (props) => {
  const {
    workingCase,
    handleCourtDateChange,
    handleCourtRoomChange,
    courtDate,
    blueBox = true,
    dateTimeDisabled,
    courtRoomDisabled,
  } = props
  const [courtRoomValue, setCourtRoomValue] = useState<string>('')

  const isCorrectingRuling = workingCase.notifications?.some(
    (notification) => notification.type === NotificationType.RULING,
  )

  useEffect(() => {
    if (courtDate?.location) {
      setCourtRoomValue(courtDate.location)
    }
  }, [courtDate?.location])

  const renderCourtArrangements = () => (
    <>
      <Box marginBottom={2}>
        <DateTime
          name="courtDate"
          selectedDate={courtDate?.date}
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
          handleCourtRoomChange(evt.target.value)
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
