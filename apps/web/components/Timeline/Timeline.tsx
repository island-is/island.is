import React, { FC, useMemo, ReactNode } from 'react'
import {
  Box,
  Typography,
  Timeline as UITimeline,
  TimelineEvent,
} from '@island.is/island-ui/core'
import * as styles from './Timeline.treat'

export interface TimelineEventProps {
  date: string
  title: string
  numerator?: number
  denominator?: number
  label?: string
  body?: ReactNode
  tags?: string[]
  link?: string
}

export interface TimelineProps {
  title: string
  events: TimelineEventProps[]
}

export const Timeline: FC<TimelineProps> = ({ title, events }) => {
  const mappedEvents = useMemo(() => events.map(mapEvent), [events])

  return (
    <div>
      <Box paddingTop={2} paddingBottom={5} className={styles.indent}>
        <Typography variant="p" as="p" color="white">
          {title}
        </Typography>
      </Box>
      <UITimeline events={mappedEvents} />
    </div>
  )
}

const mapEvent = (e: TimelineEventProps): TimelineEvent => ({
  date: new Date(e.date),
  title: e.title,
  value: e.numerator,
  maxValue: e.denominator,
  valueLabel: e.label,
  data: e.body && {
    labels: e.tags,
    text: e.body,
    link: e.link,
  },
})

export default Timeline
