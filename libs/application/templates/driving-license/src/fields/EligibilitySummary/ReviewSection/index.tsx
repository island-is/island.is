import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'

import * as styles from './ReviewSection.css'
import { MessageDescriptor } from '@formatjs/intl'
import { requirementsMessages } from '../../../lib/messages'
import { m } from '../../../lib/messages'
import isNumber from 'lodash/isNumber'

export enum ReviewSectionState {
  inProgress = 'In progress',
  requiresAction = 'Requires action',
  complete = 'Complete',
}

export interface Step {
  title: MessageDescriptor
  description: MessageDescriptor
  residenceRequirement?: MessageDescriptor
  state: ReviewSectionState
  daysOfResidency?: number
}

type ReviewSectionProps = {
  application: Application
  step: Step
  index: number
}

const ReviewSection: FC<React.PropsWithChildren<ReviewSectionProps>> = ({
  step: { state, description, title, daysOfResidency },
}) => {
  const { formatMessage } = useLocale()

  const showLocalRequirementDays: boolean =
    isNumber(daysOfResidency) &&
    state === ReviewSectionState.requiresAction &&
    title === requirementsMessages.localResidencyTitle

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
        flexDirection={'row'}
        justifyContent="spaceBetween"
      >
        <Text variant="h3">{formatMessage(title)}</Text>
        {state === ReviewSectionState.complete && (
          <Box pointerEvents="none">
            <button type="button" className={styles.container}>
              <Text variant="eyebrow" as="span">
                {formatMessage(m.externalDataComplete)}
              </Text>
            </button>
          </Box>
        )}
        {state === ReviewSectionState.requiresAction && (
          <Box pointerEvents="none" style={{ whiteSpace: 'nowrap' }}>
            <Tag variant="red">
              {formatMessage(coreMessages.tagsRequiresAction)}
            </Tag>
          </Box>
        )}
      </Box>
      <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
        <Text marginTop={1} variant="default">
          {formatMessage(description)}
        </Text>
        {showLocalRequirementDays && (
          <Text
            marginTop={2}
            fontWeight="medium"
          >{`Þú hefur aðeins búið á Íslandi í ${daysOfResidency} daga.`}</Text>
        )}
      </Box>
    </Box>
  )
}

export default ReviewSection
