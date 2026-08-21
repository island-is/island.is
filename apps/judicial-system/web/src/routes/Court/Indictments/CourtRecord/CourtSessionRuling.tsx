import { FC, useContext } from 'react'

import { Box, Input } from '@island.is/island-ui/core'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSessionResponse,
  CourtSessionRulingType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDebouncedField } from '@island.is/judicial-system-web/src/utils/hooks'

import CourtSessionAppealDecisions from './CourtSessionAppealDecisions'

type PatchCourtSession = (
  courtSessionId: string,
  updates: Partial<CourtSessionResponse>,
  options?: { persist?: boolean },
) => void

interface Props {
  courtSession: CourtSessionResponse
  patchSession: PatchCourtSession
}

/**
 * The ruling half of a court session: what was pronounced, the in-court appeal
 * decisions that follow from it, and the bookings made afterwards.
 *
 * Its own component so that it unmounts when the session moves back to "no
 * ruling", because that click also clears `ruling` and `closingEntries` on the
 * server. A debounced field ignores the persisted value once the user has
 * typed, so a longer-lived instance would keep showing text the case no longer
 * has - and the confirm button, which reads the case, would stay disabled
 * against a visibly filled in ruling. Unmounting re-initialises it instead.
 *
 * Switching between the three ruling types keeps this mounted, which is what we
 * want: those only relabel the field, they do not clear it.
 */
const CourtSessionRuling: FC<Props> = (props) => {
  const { courtSession, patchSession } = props
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const isJudgement =
    courtSession.rulingType === CourtSessionRulingType.JUDGEMENT
  const rulingLabel = isJudgement ? 'Dómsorð' : 'Úrskurðarorð'

  const rulingField = useDebouncedField({
    value: courtSession.ruling,
    validations: ['empty'],
    onChange: (ruling) => patchSession(courtSession.id, { ruling }),
    onSave: (ruling) =>
      patchSession(courtSession.id, { ruling }, { persist: true }),
  })

  const closingEntriesField = useDebouncedField({
    value: courtSession.closingEntries,
    onChange: (closingEntries) =>
      patchSession(courtSession.id, { closingEntries }),
    onSave: (closingEntries) =>
      patchSession(courtSession.id, { closingEntries }, { persist: true }),
  })

  return (
    <>
      <Box>
        <SectionHeading title={rulingLabel} />
        <Input
          data-testid="ruling"
          name="ruling"
          label={rulingLabel}
          value={rulingField.value}
          placeholder={`Hvert er ${
            isJudgement ? 'dómsorðið' : 'úrskurðarorðið'
          }?`}
          onChange={(event) => rulingField.onChange(event.target.value)}
          onBlur={(event) => rulingField.onBlur(event.target.value)}
          hasError={rulingField.hasError}
          errorMessage={rulingField.errorMessage}
          rows={15}
          disabled={courtSession.isConfirmed || false}
          textarea
          required
        />
      </Box>
      {courtSession.rulingType === CourtSessionRulingType.ORDER && (
        <CourtSessionAppealDecisions
          courtSession={courtSession}
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
        />
      )}
      <Box>
        <SectionHeading title="Bókanir í lok þinghalds" />
        <Input
          data-testid="closingEntries"
          name="closingEntries"
          label="Bókanir í kjölfar dómsuppsögu eða uppkvaðningu úrskurðar"
          value={closingEntriesField.value}
          placeholder="T.d. Dómfelldi er ekki viðstaddur dómsuppsögu og verður lögreglu falið að birta dóminn fyrir honum..."
          onChange={(event) => closingEntriesField.onChange(event.target.value)}
          onBlur={(event) => closingEntriesField.onBlur(event.target.value)}
          rows={15}
          disabled={courtSession.isConfirmed || false}
          textarea
        />
      </Box>
    </>
  )
}

export default CourtSessionRuling
