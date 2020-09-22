import React, { FC, useMemo, ReactNode } from 'react'
import {
  Box,
  Typography,
  Timeline as UITimeline,
  TimelineEvent,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useDateUtils } from '../../i18n/useDateUtils'

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
  const { getMonthByIndex } = useDateUtils()

  return (
    <>
      <GridRow>
        <GridColumn offset={[null, null, null, '1/9']}>
          <Box paddingTop={2} paddingBottom={5}>
            <Typography variant="p" as="p" color="white">
              {title}
            </Typography>
          </Box>
        </GridColumn>
      </GridRow>
      <UITimeline getMonthByIndex={getMonthByIndex} events={mappedEvents} />
    </>
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
