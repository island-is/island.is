import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { requestCourtDate as m } from '@island.is/judicial-system-web/messages'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

interface Props {
  workingCase: Case
  onChange: (date: Date | undefined, valid: boolean) => void
}

const RequestCourtDate: React.FC<React.PropsWithChildren<Props>> = (props) => {
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
        selectedDate={workingCase.requestedCourtDate}
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
