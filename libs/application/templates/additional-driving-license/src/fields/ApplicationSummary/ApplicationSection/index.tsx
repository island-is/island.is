import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'

import * as styles from './ApplicationSection.css'
import { MessageDescriptor } from '@formatjs/intl'
import { requirementsMessages } from '../../../lib/messages'
import { m } from '../../../lib/messages'
import { roseTinted600 } from '@island.is/island-ui/theme'

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
  step: {
    group: string
    subGroup: string
    title: MessageDescriptor
    description: MessageDescriptor
  }
  index: number
}

const ApplicationSection: FC<React.PropsWithChildren<ReviewSectionProps>> = ({
  step: { group, subGroup, title, description },
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      padding={4}
      marginBottom={2}
      borderColor={group === subGroup ? 'mint600' : 'roseTinted600'}
    >
      {/* Section Number */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        className={cn(styles.sectionNumber, {
          [styles.sectionNumberMainGroup]: group === subGroup,
          [styles.sectionNumberSubGroup]: group !== subGroup,
        })}
      >
        <Icon color="white" size="medium" icon="checkmark" />
      </Box>

      {/* Contents */}
      <Box
        alignItems="flexStart"
        display="flex"
        flexDirection={'row'}
        justifyContent="spaceBetween"
      >
        <Text variant="h3">{formatMessage(title)}</Text>
        {/* {state === ReviewSectionState.complete && (
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
        )} */}
      </Box>
      <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
        <Text marginTop={1} variant="default">
          {formatMessage(description)}
        </Text>
      </Box>
    </Box>
  )
}

export default ApplicationSection
