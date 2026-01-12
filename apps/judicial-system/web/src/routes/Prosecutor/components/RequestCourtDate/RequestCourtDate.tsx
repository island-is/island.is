import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { requestCourtDate as m } from '@island.is/judicial-system-web/messages'
import {
  DateTime,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  workingCase: Case
  onChange: (date: Date | undefined, valid: boolean) => void
}

const RequestCourtDate: FC<Props> = ({ workingCase, onChange }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <SectionHeading
        title={formatMessage(m.heading)}
        tooltip={formatMessage(m.tooltip)}
      />
      <DateTime
        name="reqCourtDate"
        selectedDate={workingCase.requestedCourtDate}
        onChange={onChange}
        timeLabel={formatMessage(m.dateInput.timeLabel)}
        locked={Boolean(workingCase.arraignmentDate?.date)}
        minDate={new Date()}
        required
      />
      {workingCase.arraignmentDate?.date && (
        <Box marginTop={1}>
          <Text variant="eyebrow">{formatMessage(m.courtDate)}</Text>
        </Box>
      )}
    </>
  )
}

export default RequestCourtDate
