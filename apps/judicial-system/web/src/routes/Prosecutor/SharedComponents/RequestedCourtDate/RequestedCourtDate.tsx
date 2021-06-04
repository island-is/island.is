import React, { useState } from 'react'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'
import { newSetAndSendDateToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { Case } from '@island.is/judicial-system/types'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const RequestedCourtDate: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { updateCase } = useCase()
  const [, setRequestedCourtDateIsValid] = useState(
    workingCase.requestedCourtDate !== null,
  )

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          Ósk um fyrirtökudag og tíma{' '}
          <Box data-testid="requested-court-date-tooltip" component="span">
            <Tooltip text="Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma." />
          </Box>
        </Text>
      </Box>
      <DateTime
        name="reqCourtDate"
        selectedDate={
          workingCase.requestedCourtDate
            ? new Date(workingCase.requestedCourtDate)
            : undefined
        }
        onChange={(date: Date | undefined, valid: boolean) =>
          newSetAndSendDateToServer(
            'requestedCourtDate',
            date,
            valid,
            workingCase,
            setWorkingCase,
            setRequestedCourtDateIsValid,
            updateCase,
          )
        }
        timeLabel="Ósk um tíma (kk:mm)"
        locked={workingCase.courtDate !== null}
        minDate={new Date()}
        required
      />
      {workingCase.courtDate && (
        <Box marginTop={1}>
          <Text variant="eyebrow">
            Fyrirtökudegi og tíma hefur verið úthlutað
          </Text>
        </Box>
      )}
    </>
  )
}

export default RequestedCourtDate
