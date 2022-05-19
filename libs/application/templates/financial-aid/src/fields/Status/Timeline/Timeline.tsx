import React, { useState } from 'react'
import cn from 'classnames'
import { useIntl } from 'react-intl'
import findLastIndex from 'lodash/findLastIndex'

import { Text, Box } from '@island.is/island-ui/core'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import * as styles from './Timeline.css'
import { timeline } from '../../../lib/messages'
import { timelineSections } from '../../../lib/formatters'

interface Props {
  state?: ApplicationState
  modified: Date | string
  created: Date | string
  showSpouseStep?: boolean
}

const Timeline = ({ state, modified, created, showSpouseStep }: Props) => {
  if (!state) {
    return null
  }

  const { formatMessage } = useIntl()

  const sections = timelineSections(
    new Date(created),
    new Date(modified),
    showSpouseStep,
  )

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
              <Text variant="h5">{formatMessage(item.name)}</Text>
              <Text marginBottom={2}>{formatMessage(item.text)}</Text>

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
