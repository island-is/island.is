import React, { ReactNode } from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import {
  ApplicationEventType,
  getEventType,
} from '@island.is/financial-aid/shared/lib'
import * as styles from '../History/History.treat'
import cn from 'classnames'
import { format } from 'date-fns'

interface Props {
  eventType: ApplicationEventType
  comment?: string
  children: ReactNode
  [key: string]: any
  applicantName: string
  created: string
  staffName?: string
}

const TimeLineContainer = ({
  eventType,
  applicantName,
  children,
  created,
  staffName,
}: Props) => {
  return (
    <Box
      className={cn({
        [`${styles.timelineContainer}`]: true,
        [`${styles.acceptedEvent}`]:
          eventType === ApplicationEventType.APPROVED,
        [`${styles.rejectedEvent}`]:
          eventType === ApplicationEventType.REJECTED,
      })}
    >
      <Box paddingLeft={3}>
        <Text variant="h5">{getEventType[eventType].header}</Text>
        <Text marginBottom={2}>
          {' '}
          {getEventType[eventType].isStaff
            ? staffName
              ? staffName
              : 'Starfsmaður'
            : `Umsækjandi ${applicantName}`}{' '}
          <strong>{getEventType[eventType].text} </strong>
        </Text>

        {children}

        <Text variant="small" color="dark300" marginBottom={5}>
          {format(new Date(created), 'dd/MM/yyyy HH:MM')}
        </Text>
      </Box>
    </Box>
  )
}

export default TimeLineContainer
