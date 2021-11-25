import React from 'react'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import type { Case } from '@island.is/judicial-system/types'
import { useIntl } from 'react-intl'
import { requestCourtDate as m } from '@island.is/judicial-system-web/messages'
import { DateTime } from '@island.is/judicial-system-web/src/components'

interface Props {
  workingCase: Case
  onChange: (date: Date | undefined, valid: boolean) => void
}

const RequestCourtDate: React.FC<Props> = (props) => {
  const { workingCase, onChange } = props
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {formatMessage(m.heading)}{' '}
          <Box data-testid="requested-court-date-tooltip" component="span">
            <Tooltip text={formatMessage(m.tooltip)} />
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
        onChange={onChange}
        timeLabel={formatMessage(m.dateInput.timeLabel)}
        locked={
          workingCase.courtDate !== null && workingCase.courtDate !== undefined
        }
        minDate={new Date()}
        required
      />
      {workingCase.courtDate && (
        <Box marginTop={1}>
          <Text variant="eyebrow">{formatMessage(m.courtDate)}</Text>
        </Box>
      )}
    </>
  )
}

export default RequestCourtDate
