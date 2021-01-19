import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { Application, formatText } from '@island.is/application/core'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import { m } from '@island.is/application/ui-shell'

import * as styles from './ReviewSection.treat'

export enum reviewSectionState {
  inProgress = 'In progress',
  requiresAction = 'Requires action',
  complete = 'Complete',
}

type ReviewSectionProps = {
  application: Application
  index: number
  title: string
  description: string
  state?: reviewSectionState
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
            state === reviewSectionState.inProgress,
          [styles.sectionNumberRequiresAction]:
            state === reviewSectionState.requiresAction,
          [styles.sectionNumberComplete]: state === reviewSectionState.complete,
        })}
      >
        {(state === reviewSectionState.complete && (
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

        {state === reviewSectionState.inProgress && (
          <Box pointerEvents="none">
            <Tag variant="blue">
              {formatText(m.tagsInProgress, application, formatMessage)}
            </Tag>
          </Box>
        )}
        {state === reviewSectionState.requiresAction && (
          <Box pointerEvents="none">
            <Tag variant="red">
              {formatText(m.tagsRequiresAction, application, formatMessage)}
            </Tag>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReviewSection
