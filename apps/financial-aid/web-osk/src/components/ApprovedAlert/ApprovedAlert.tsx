import React, { useMemo } from 'react'

import {
  ApplicationEvent,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'

interface Props {
  events?: ApplicationEvent[]
}

const ApprovedAlert = ({ events }: Props) => {
  const approvedComment = useMemo(() => {
    if (events) {
      return events.find((el) => el.eventType === ApplicationEventType.APPROVED)
        ?.comment
    }
  }, [events])
    ?.split('\n')
    .slice(1)
    .join('\n')

  if (!approvedComment) {
    return null
  }

  return (
    <Box marginBottom={[4, 4, 5]}>
      <AlertMessage
        type="info"
        title={'Skýring frá vinnsluaðila'}
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
