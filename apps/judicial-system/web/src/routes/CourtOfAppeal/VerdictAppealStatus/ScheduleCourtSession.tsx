import type { FC } from 'react'

import { Box, Input, Select } from '@island.is/island-ui/core'
import {
  BlueBox,
  DateTime,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import type {
  AppealCourtSession,
  AppealCourtSessionType,
} from './VerdictAppealStatus.logic'
import { appealCourtSessionTypeOptions } from './VerdictAppealStatus.logic'

interface Props {
  session: AppealCourtSession
  onChange: (session: AppealCourtSession) => void
}

/**
 * The form the court fills in to call a session: its type, when it is held
 * and in which room.
 *
 * Just the form. Completing it does nothing yet - no booking, no list of
 * sessions, nothing sent anywhere. Those arrive with the slices that follow
 * this one, and the values live in the page's state until then.
 */
const ScheduleCourtSession: FC<Props> = ({ session, onChange }) => {
  const selectedTypeOption =
    appealCourtSessionTypeOptions.find(
      (option) => option.value === session.type,
    ) ?? null

  return (
    <Box component="section">
      <SectionHeading title="Boða til þinghalds" />
      <BlueBox className={stack({ gap: 2 })}>
        <Select
          name="appeal-court-session-type"
          label="Tegund þinghalds"
          placeholder="Veldu tegund þinghalds"
          options={appealCourtSessionTypeOptions}
          value={selectedTypeOption}
          onChange={(selectedOption) =>
            onChange({
              ...session,
              type: selectedOption
                ? (selectedOption.value as AppealCourtSessionType)
                : undefined,
            })
          }
          required
        />
        <DateTime
          name="appeal-court-session-date"
          datepickerLabel="Dagsetning"
          datepickerPlaceholder="Veldu dagsetningu"
          timeLabel="Tímasetning"
          selectedDate={session.date}
          minDate={new Date()}
          blueBox={false}
          required
          onChange={(date, valid) => {
            // Nothing while the time is half typed. DateTime reports no date
            // for an invalid time, and writing that back through
            // `selectedDate` would clear the date the court just picked.
            if (valid && date) {
              onChange({ ...session, date })
            }
          }}
        />
        <Input
          name="appeal-court-session-court-room"
          label="Dómsalur"
          placeholder="Skráðu inn dómsal"
          autoComplete="off"
          value={session.courtRoom ?? ''}
          onChange={(evt) =>
            onChange({ ...session, courtRoom: evt.target.value })
          }
          required
        />
      </BlueBox>
    </Box>
  )
}

export default ScheduleCourtSession
