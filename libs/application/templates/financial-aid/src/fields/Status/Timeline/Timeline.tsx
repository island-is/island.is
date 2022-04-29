import React, { useState } from 'react'
import cn from 'classnames'
import format from 'date-fns/format'
import { useIntl } from 'react-intl'
import findLastIndex from 'lodash/findLastIndex'

import { Text, Box } from '@island.is/island-ui/core'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import * as styles from './Timeline.css'
import { timeline } from '../../../lib/messages'

interface Props {
  state: ApplicationState
  modified: Date
  created: Date
  showSpouseStep?: boolean
}

const Timeline = ({ state, modified, created, showSpouseStep }: Props) => {
  const { formatMessage } = useIntl()

  const sections = [
    {
      name: formatMessage(timeline.receivedTitle),
      text: formatMessage(timeline.receivedDescription),
      state: [ApplicationState.NEW],
      date: format(new Date(created), 'dd/MM/yyyy HH:mm'),
    },
    {
      name: formatMessage(timeline.inProgressTitle),
      text: formatMessage(timeline.inProgressDescription),
      state: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
      date: format(new Date(modified), 'dd/MM/yyyy HH:mm'),
    },
    {
      name: formatMessage(timeline.resultsTitle),
      text: formatMessage(timeline.resultsDescription),
      state: [ApplicationState.REJECTED, ApplicationState.APPROVED],
      date: format(new Date(modified), 'dd/MM/yyyy HH:mm'),
    },
  ]

  if (showSpouseStep) {
    sections.splice(1, 0, {
      name: formatMessage(timeline.spouseTitle),
      text: formatMessage(timeline.spouseDescription),
      state: [ApplicationState.NEW],
      date: format(new Date(created), 'dd/MM/yyyy HH:mm'),
    })
  }

  const [activeState] = useState(
    findLastIndex(sections, (el) => el.state.includes(state)),
  )

  return (
    <>
      <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
        {formatMessage(timeline.title)}
      </Text>
      <Text marginBottom={[3, 3, 4]}>
        {formatMessage(timeline.description)}
      </Text>

      {sections.map((item, index) => {
        return (
          <Box
            key={`${index}--${item.text}`}
            className={cn({
              [`${styles.timelineContainer}`]: true,
              [`${styles.activeState}`]: activeState >= index,
              [`${styles.lineDown}`]: index !== sections.length - 1,
              [`${styles.activeLine}`]: activeState > index,
            })}
          >
            <Box paddingLeft={3}>
              <Text variant="h5">{item.name}</Text>
              <Text marginBottom={2}>{item.text}</Text>

              <Text variant="small" color="dark300" marginBottom={5}>
                {(index === 0 || index === activeState) && item.date}
              </Text>
            </Box>
          </Box>
        )
      })}
    </>
  )
}

export default Timeline
