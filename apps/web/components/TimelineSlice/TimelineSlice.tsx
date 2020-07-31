import React, { FC, useMemo } from 'react'
import {
  TimelineSlice as ApiTimelineSlice,
  TimelineEvent as ApiTimelineEvent,
} from '@island.is/api/schema'
import {
  Box,
  Typography,
  Timeline,
  TimelineEvent,
} from '@island.is/island-ui/core'

export const TimelineSlice: FC<ApiTimelineSlice> = ({ title, events }) => {
  const mappedEvents = useMemo(() => events.map(mapEvent), [events])

  return (
    <div>
      <Box marginLeft={12} paddingY={5}>
        <Typography variant="p" as="p" color="white">
          {title}
        </Typography>
      </Box>
      <Timeline events={mappedEvents} />
    </div>
  )
}

const mapEvent = (e: ApiTimelineEvent): TimelineEvent => ({
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

export default TimelineSlice
