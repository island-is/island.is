import React, { FC, useMemo, ReactNode } from 'react'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useDateUtils } from '../../i18n/useDateUtils'
import { Timeline, TimelineEvent } from './Timeline'

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

export interface TimelineSectionProps {
  title: string
  events: TimelineEventProps[]
}

export const TimelineSection: FC<TimelineSectionProps> = ({
  title,
  events,
}) => {
  const mappedEvents = useMemo(() => events.map(mapEvent), [events])
  const { getMonthByIndex } = useDateUtils()

  return (
    <>
      <GridRow>
        <GridColumn offset={[null, null, null, '1/9']}>
          <Box paddingTop={2} paddingBottom={[0, 0, 5]}>
            <Text variant="default" as="p" color="white">
              {title}
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
      <Timeline getMonthByIndex={getMonthByIndex} events={mappedEvents} />
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

export default TimelineSection
