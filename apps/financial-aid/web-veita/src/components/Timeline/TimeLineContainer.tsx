import React, { ReactNode } from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import {
  ApplicationEvent,
  ApplicationEventType,
  getEventData,
} from '@island.is/financial-aid/shared/lib'
import * as styles from '../History/History.css'
import cn from 'classnames'
import { format } from 'date-fns'

interface Props {
  event: ApplicationEvent
  comment?: string
  children: ReactNode
  [key: string]: any
  applicantName: string
  spouseName: string
}

const TimeLineContainer = ({
  event,
  applicantName,
  spouseName,
  children,
}: Props) => {
  const eventData = getEventData(event, applicantName, spouseName)
  return (
    <Box
      className={cn({
        [`${styles.timelineContainer}`]: true,
        [`${styles.acceptedEvent}`]:
          event.eventType === ApplicationEventType.APPROVED,
        [`${styles.rejectedEvent}`]:
          event.eventType === ApplicationEventType.REJECTED,
      })}
    >
      <Box paddingLeft={3}>
        <Text variant="h5">{eventData.header}</Text>
        <Text marginBottom={2}>
          {eventData.prefix} <strong>{eventData.text}</strong>
        </Text>
        {children}
        <Text variant="small" color="dark300" marginBottom={5}>
          {format(new Date(event.created), 'dd/MM/yyyy HH:MM')}
        </Text>
      </Box>
    </Box>
  )
}

export default TimeLineContainer
