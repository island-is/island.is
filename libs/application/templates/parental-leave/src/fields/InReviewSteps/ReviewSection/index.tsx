import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { formatText, coreMessages } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Box, Button, Icon, Tag, Text } from '@island.is/island-ui/core'

import * as styles from './ReviewSection.css'
import { parentalLeaveFormMessages } from '../../../lib/messages'


export enum ReviewSectionState {
  inProgress = 'In progress',
  requiresAction = 'Requires action',
  complete = 'Complete',
  optionalAction = 'Optional action'
}

type ReviewSectionProps = {
  application: Application
  index: number
  title: string
  description: string
  state?: ReviewSectionState
  notifyParentComponent?: () => void
}

const ReviewSection: FC<ReviewSectionProps> = ({
  application,
  index,
  title,
  description,
  state,
  notifyParentComponent,
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
          [styles.sectionNumberOptionalAction]: state === ReviewSectionState.optionalAction,
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
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]} width='full'>
          <Text variant="h3">{title}</Text>
          <Text marginTop={1} variant="default">
            {description}
          </Text>
          {notifyParentComponent && state === ReviewSectionState.optionalAction  &&
            <Box display={'flex'} justifyContent={'flexEnd'}>
              <Box>
                <Button
                  variant="text"
                  icon="arrowForward"
                  onClick={() => notifyParentComponent()}
                  >
                    {formatText(
                coreMessages.tagsInProgress,
                application,
                formatMessage,
              )}
                  Sækja um dvalarstyrk
                </Button>
              </Box>
            </Box>
          }
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
