import type { FC } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { requestCourtDate as m } from '@island.is/judicial-system-web/messages'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  DateTime,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'

interface Props {
  workingCase: WorkingCase
  onChange: (date: Date | undefined, valid: boolean) => void
}

const RequestCourtDate: FC<Props> = ({ workingCase, onChange }) => {
  return (
    <>
      <SectionHeading title={m.heading} tooltip={m.tooltip} />
      <DateTime
        name="reqCourtDate"
        selectedDate={workingCase.requestedCourtDate}
        onChange={onChange}
        timeLabel={m.dateInput.timeLabel}
        locked={Boolean(workingCase.arraignmentDate?.date)}
        minDate={new Date()}
        required
      />
      {workingCase.arraignmentDate?.date && (
        <Box marginTop={1}>
          <Text variant="eyebrow">{m.courtDate}</Text>
        </Box>
      )}
    </>
  )
}

export default RequestCourtDate
