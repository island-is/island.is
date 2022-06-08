import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import {
  ApplicationEvent,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'

import { approvedAlert } from '../../../lib/messages'

interface Props {
  events?: ApplicationEvent[]
}

const ApprovedAlert = ({ events }: Props) => {
  const { formatMessage } = useIntl()

  const approvedComment = useMemo(() => {
    if (events) {
      return events.find((el) => el.eventType === ApplicationEventType.APPROVED)
        ?.comment
    }
  }, [events])

  if (!approvedComment) {
    return null
  }

  return (
    <Box marginBottom={[4, 4, 5]}>
      <AlertMessage
        type="info"
        title={formatMessage(approvedAlert.title)}
        message={
          <Text variant="small" whiteSpace="breakSpaces">
            „{approvedComment}“
          </Text>
        }
      />
    </Box>
  )
}

export default ApprovedAlert
