import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import {
  Application,
  formatText,
  coreMessages,
} from '@island.is/application/core'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'

import * as styles from './ReviewSection.css'

export enum ReviewSectionState {
  inProgress = 'In progress',
  requiresAction = 'Requires action',
  complete = 'Complete',
}

type ReviewSectionProps = {
  application: Application
  index: number
  title: string
  description: string
  state?: ReviewSectionState
}

const ReviewSection: FC<ReviewSectionProps> = ({
  application,
  index,
  title,
  description,
  state,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      padding={4}
      marginBottom={2}
    >
      {/* Section Number */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        className={cn(styles.sectionNumber, {
          [styles.sectionNumberNotStarted]: state === undefined,
          [styles.sectionNumberInProgress]:
            state === ReviewSectionState.inProgress,
          [styles.sectionNumberRequiresAction]:
            state === ReviewSectionState.requiresAction,
          [styles.sectionNumberComplete]: state === ReviewSectionState.complete,
        })}
      >
        {(state === ReviewSectionState.complete && (
          <Icon color="white" size="small" icon="checkmark" />
        )) || <span className={styles.sectionNumberText}>{index}</span>}
      </Box>

      {/* Contents */}
      <Box
        alignItems="flexStart"
        display="flex"
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
      >
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Text variant="h3">{title}</Text>
          <Text marginTop={1} variant="default">
            {description}
          </Text>
        </Box>

        {state === ReviewSectionState.inProgress && (
          <Box pointerEvents="none">
            <Tag variant="blue">
              {formatText(
                coreMessages.tagsInProgress,
                application,
                formatMessage,
              )}
            </Tag>
          </Box>
        )}
        {state === ReviewSectionState.requiresAction && (
          <Box pointerEvents="none">
            <Tag variant="red">
              {formatText(
                coreMessages.tagsRequiresAction,
                application,
                formatMessage,
              )}
            </Tag>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReviewSection
