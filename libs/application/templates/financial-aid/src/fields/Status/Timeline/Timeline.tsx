import React, { useEffect, useState } from 'react'
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
  const sections = timelineSections(
    new Date(created),
    new Date(modified),
    showSpouseStep,
  )

  const findActiveState = () =>
    findLastIndex(sections, (el) => {
      return el.state.includes(state as ApplicationState)
    })

  const { formatMessage } = useIntl()
  const [activeState, setActiveState] = useState(findActiveState())

  useEffect(() => {
    setActiveState(findActiveState())
  }, [state])

  if (!state) {
    return null
  }

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
