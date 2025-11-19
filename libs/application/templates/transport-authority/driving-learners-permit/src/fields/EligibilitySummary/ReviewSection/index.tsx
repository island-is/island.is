import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'

import * as styles from './ReviewSection.css'
import { m } from '../../../lib/messages'
import { ReviewSectionProps, ReviewSectionState } from '../../../lib/constants'

const ReviewSection: FC<React.PropsWithChildren<ReviewSectionProps>> = ({
  step: { state, description, title },
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      padding={4}
      marginBottom={2}
      borderColor={state === ReviewSectionState.complete ? 'mint600' : 'red600'}
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
        )) || <Icon color="white" size="small" icon="warning" />}
      </Box>

      {/* Contents */}
      <Box
        alignItems="flexStart"
        display="flex"
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
      >
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Text variant="h3">{formatMessage(title)}</Text>
          <Text marginTop={1} variant="default">
            {formatMessage(description)}
          </Text>
        </Box>

        {state === ReviewSectionState.complete && (
          <Box pointerEvents="none">
            <button type="button" className={styles.container}>
              <Text variant="eyebrow" as="span">
                {formatMessage(m.applicationEligibilitySuccess)}
              </Text>
            </button>
          </Box>
        )}
        {state === ReviewSectionState.requiresAction && (
          <Box pointerEvents="none">
            <Tag variant="red">
              {formatMessage(coreMessages.tagsRequiresAction)}
            </Tag>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReviewSection
