import type { FC } from 'react'

import { Box, Input, Select, Text } from '@island.is/island-ui/core'
import { appealCourtSessionTypeNames } from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import type {
  AppealCourtSession,
  AppealCourtSessionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import type { AppealCourtSessionDraft } from './VerdictAppealStatus.logic'
import {
  appealCourtSessionTypeOptions,
  formatAppealCourtSessionDetails,
} from './VerdictAppealStatus.logic'

interface Props {
  session: AppealCourtSessionDraft
  onChange: (session: AppealCourtSessionDraft) => void
  // The sessions already booked in the appeal, listed under the form.
  bookedSessions: AppealCourtSession[]
}

/**
 * The form the court fills in to call a session - its type, when it is held
 * and in which room - and the list of sessions already called.
 *
 * The form is a draft; the page books it when the court continues. The list
 * is read only.
 */
const ScheduleCourtSession: FC<Props> = ({
  session,
  onChange,
  bookedSessions,
}) => {
  const selectedTypeOption =
    appealCourtSessionTypeOptions.find(
      (option) => option.value === session.sessionType,
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
              sessionType: selectedOption
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
          selectedDate={session.sessionDate}
          minDate={new Date()}
          blueBox={false}
          required
          onChange={(date, valid) =>
            onChange({
              ...session,
              // The date stays while the time is half typed or cleared.
              // DateTime reports no date then, and writing that back
              // through `selectedDate` would clear the day the court just
              // picked. The flag is what says the field is filled in.
              sessionDate: valid && date ? date : session.sessionDate,
              isSessionDateValid: valid,
            })
          }
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
      {bookedSessions.length > 0 && (
        <Box component="section" marginTop={5}>
          <SectionHeading title="Bókuð þinghöld" marginBottom={1} />
          <Box component="ul" aria-label="Bókuð þinghöld">
            {bookedSessions.map((bookedSession) => (
              <Box
                key={bookedSession.id}
                component="li"
                paddingY={2}
                borderBottomWidth="standard"
                borderColor="blue200"
              >
                <Text variant="h5">
                  {bookedSession.sessionType
                    ? appealCourtSessionTypeNames[bookedSession.sessionType]
                    : ''}
                </Text>
                <Text variant="medium" fontWeight="light">
                  {formatAppealCourtSessionDetails(bookedSession)}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ScheduleCourtSession
