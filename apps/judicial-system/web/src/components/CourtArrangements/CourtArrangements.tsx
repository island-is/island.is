import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import compareAsc from 'date-fns/compareAsc'

import { Box, Input } from '@island.is/island-ui/core'
import {
  BlueBox,
  DateTime,
} from '@island.is/judicial-system-web/src/components'
import {
  DateLog,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  formatDateForServer,
  UpdateCase,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/stepHelper'

import { strings } from './CourtArrangements.string'

interface Props {
  handleCourtDateChange: (date: Date | undefined | null, valid: boolean) => void
  handleCourtRoomChange: (courtRoom?: string) => void
  courtDate?: DateLog | null
  blueBox?: boolean
  dateTimeDisabled?: boolean
  courtRoomDisabled?: boolean
  courtRoomRequired?: boolean
}

type DateLogKey = keyof Pick<Case, 'arraignmentDate' | 'courtDate'>

export const useCourtArrangements = (
  workingCase: Case,
  setWorkingCase: (value: SetStateAction<Case>) => void,
  dateKey: DateLogKey,
) => {
  const { setAndSendCaseToServer } = useCase()
  const [original, setOriginal] =
    useState<[DateLogKey, DateLog | undefined | null]>()
  const [courtDate, setCourtDate] = useState<DateLog | null>()
  const [courtDateHasChanged, setCourtDateHasChanged] = useState(false)

  useEffect(() => {
    if (
      original &&
      original[0] === dateKey &&
      original[1]?.date === workingCase[dateKey]?.date &&
      original[1]?.location === workingCase[dateKey]?.location
    ) {
      // Do not reset the court date if it has not changed
      return
    }

    setOriginal([dateKey, workingCase[dateKey]])

    if (workingCase[dateKey]) {
      setCourtDate(workingCase[dateKey])
    }
  }, [dateKey, original, workingCase])

  const handleCourtDateChange = (
    date: Date | undefined | null,
    valid = true,
  ) => {
    if (!date) {
      setCourtDate(null)
    } else if (date && valid) {
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

  const handleCourtRoomChange = (courtRoom?: string | null) => {
    if (!courtRoom) {
      setCourtDate((prev) => ({ ...prev, location: null }))
    } else {
      setCourtDate((previous) =>
        previous
          ? { ...previous, location: courtRoom }
          : { location: courtRoom },
      )
    }
  }

  const sendCourtDateToServer = (otherUpdates: UpdateCase[] = []) => {
    return setAndSendCaseToServer(
      [
        ...otherUpdates,
        {
          [dateKey]: courtDate?.date
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

export const CourtArrangements: FC<Props> = (props) => {
  const {
    handleCourtDateChange,
    handleCourtRoomChange,
    courtDate,
    blueBox = true,
    dateTimeDisabled,
    courtRoomDisabled,
    courtRoomRequired = false,
  } = props
  const { formatMessage } = useIntl()

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
          disabled={dateTimeDisabled}
        />
      </Box>
      <Input
        data-testid="courtroom"
        name="courtroom"
        label={formatMessage(strings.courtRoomLabel)}
        autoComplete="off"
        value={courtDate?.location || ''}
        placeholder="Skráðu inn dómsal"
        onChange={(evt) => {
          handleCourtRoomChange(evt.target.value)
        }}
        disabled={courtRoomDisabled}
        required={courtRoomRequired}
      />
    </>
  )

  return blueBox ? (
    <BlueBox>{renderCourtArrangements()}</BlueBox>
  ) : (
    renderCourtArrangements()
  )
}
