import type { FC } from 'react'
import { useContext, useRef, useState } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { isCourtOfAppealsUser } from '@island.is/judicial-system/types'
import {
  DateTime,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import useAppealCase from '@island.is/judicial-system-web/src/utils/hooks/useAppealCase'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase/useCase.logic'
import { applyAppealCaseUpdate } from '@island.is/judicial-system-web/src/utils/utils'

import {
  getVerdictAppealRulingDateMinDate,
  isSameVerdictAppealRulingDate,
  isVerdictAppealRulingDateInRange,
} from './VerdictAppealSummary.logic'

/**
 * The date the appeal ended, which the Court of Appeals enters itself. It is
 * the date the stamp on the court's document carries and the one the deadlines
 * that follow are counted from, so it stays editable after the appeal is
 * confirmed. Only the court sees it until the appeal is completed and its
 * outcome released: until then everyone else is shown an appeal still in
 * progress.
 *
 * The working case takes a date only once the server has stored it, so the
 * page never offers to confirm with a date that is not on record.
 */
const VerdictAppealRulingDate: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const verdictAppealCase = workingCase.verdictAppealCase
  const { updateAppealCase } = useAppealCase()
  // The picker keeps what was typed or picked in its own state; remounting it
  // puts it back to the date on record when that is not saved.
  const [pickerKey, setPickerKey] = useState(0)
  // The picker stays editable while a date is being saved, so saves can
  // overlap and their responses arrive in any order. Each save takes the next
  // number, and only the response to the latest one is applied.
  const latestSaveRef = useRef(0)

  if (!isCourtOfAppealsUser(user)) {
    return null
  }

  const minDate = getVerdictAppealRulingDateMinDate(workingCase)
  const showStoredDate = () => setPickerKey((key) => key + 1)

  const handleChange = async (date: Date | undefined, valid: boolean) => {
    if (!verdictAppealCase) {
      return
    }

    if (!valid || !date || !isVerdictAppealRulingDateInRange(date, minDate)) {
      showStoredDate()

      return
    }

    if (
      isSameVerdictAppealRulingDate(verdictAppealCase.appealRulingDate, date)
    ) {
      return
    }

    const caseId = workingCase.id
    const appealCaseId = verdictAppealCase.id
    const appealRulingDate = formatDateForServer(date)
    const save = latestSaveRef.current + 1
    latestSaveRef.current = save

    const updated = await updateAppealCase(caseId, appealCaseId, {
      appealRulingDate,
    })

    // A later pick has been sent since. Its response decides what the working
    // case holds and whether the picker is put back.
    if (save !== latestSaveRef.current) {
      return
    }

    if (!updated) {
      showStoredDate()

      return
    }

    // The component outlives a case change, so a save that lands after the
    // court has moved on must not touch the other case.
    setWorkingCase((previous) =>
      previous.id === caseId
        ? applyAppealCaseUpdate(previous, appealCaseId, {
            appealRulingDate: updated.appealRulingDate ?? appealRulingDate,
          })
        : previous,
    )
  }

  return (
    <Box component="section">
      <SectionHeading
        title="Dagsetning lykta"
        description={
          <>
            <Text>
              Vinsamlegast skráið dagsetningu lykta, þ.e. hvenær dómur var
              kveðinn upp, dagsetning viðurlagaákvörðunar eða annarra lykta.
            </Text>
            <Text>
              Þessi dagsetning skilar sér til ríkissaksóknara og
              áfrýjunarfrestir og aðrir frestir miðast við hana.
            </Text>
          </>
        }
      />
      <DateTime
        key={pickerKey}
        name="appealRulingDate"
        datepickerLabel="Dagsetning lykta"
        datepickerPlaceholder="Veldu dagsetningu"
        selectedDate={verdictAppealCase?.appealRulingDate}
        minDate={minDate}
        maxDate={new Date()}
        onChange={handleChange}
        dateOnly
        required
      />
    </Box>
  )
}

export default VerdictAppealRulingDate
