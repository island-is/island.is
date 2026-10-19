import type { FC } from 'react'

import { Box, Input, Select, Tag, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { appealCourtSessionTypeNames } from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
  PopIn,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import ContextMenu from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import IconButton from '@island.is/judicial-system-web/src/components/IconButton/IconButton'
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
import * as styles from './ScheduleCourtSession.css'

interface Props {
  session: AppealCourtSessionDraft
  onChange: (session: AppealCourtSessionDraft) => void
  // The sessions already booked in the appeal, listed under the form.
  bookedSessions: AppealCourtSession[]
  // The booked session the form currently holds, if the court is changing one.
  editingSessionId?: string
  onEdit: (session: AppealCourtSession) => void
  onDelete: (session: AppealCourtSession) => void
}

/**
 * The form the court fills in to call a session - its type, when it is held
 * and in which room - and the list of sessions already called.
 *
 * The form is a draft; the page books it when the court continues, or writes
 * it back over the session being changed. Each booked session has a menu to
 * change or cancel it; what either does is the page's business.
 */
const ScheduleCourtSession: FC<Props> = ({
  session,
  onChange,
  bookedSessions,
  editingSessionId,
  onEdit,
  onDelete,
}) => {
  const selectedTypeOption =
    appealCourtSessionTypeOptions.find(
      (option) => option.value === session.sessionType,
    ) ?? null

  const sessionTitle = (bookedSession: AppealCourtSession) =>
    bookedSession.sessionType
      ? appealCourtSessionTypeNames[bookedSession.sessionType]
      : 'þinghald'

  return (
    <Box component="section">
      <SectionHeading
        title={editingSessionId ? 'Breyta þinghaldi' : 'Boða til þinghalds'}
      />
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
            {bookedSessions.map((bookedSession) => {
              const title = sessionTitle(bookedSession)
              const isBeingEdited = bookedSession.id === editingSessionId

              return (
                <Box
                  key={bookedSession.id}
                  component="li"
                  display="flex"
                  alignItems="center"
                  columnGap={2}
                  paddingY={2}
                  borderBottomWidth="standard"
                  borderColor="blue200"
                >
                  <Box flexGrow={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      columnGap="p2"
                      className={styles.sessionTitle}
                    >
                      <Text variant="h5">{title}</Text>
                      <PopIn show={isBeingEdited}>
                        <Tag variant="blue">Verið að breyta</Tag>
                      </PopIn>
                    </Box>
                    <Text variant="medium" fontWeight="light">
                      {formatAppealCourtSessionDetails(bookedSession)}
                    </Text>
                  </Box>
                  <ContextMenu
                    items={[
                      {
                        title: 'Breyta þinghaldi',
                        icon: 'pencil',
                        onClick: () => onEdit(bookedSession),
                      },
                      {
                        title: 'Eyða þinghaldi',
                        icon: 'trash',
                        onClick: () => onDelete(bookedSession),
                      },
                    ]}
                    render={
                      <IconButton
                        icon="ellipsisVertical"
                        colorScheme="transparent"
                        // Without the room: a label that says "Dómsalur" would
                        // answer for the court room input as well.
                        ariaLabel={`Valmynd fyrir ${title} ${formatDate(
                          bookedSession.sessionDate,
                          "dd.MM.yyyy 'kl.' HH:mm",
                        )}`}
                      />
                    }
                  />
                </Box>
              )
            })}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ScheduleCourtSession
