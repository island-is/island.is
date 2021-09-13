import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import {
  Application,
  formatText,
  coreMessages,
} from '@island.is/application/core'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import { Bullets } from '../../'
import * as styles from './WarningSection.treat'
import { MessageDescriptor } from '@formatjs/intl'
import { m } from '../../../lib/messages'

export interface Step {
  key: string
  title: MessageDescriptor
  description: MessageDescriptor
  state: boolean
}

type WarningSectionProps = {
  application: Application
  step: Step
}

const WarningSection: FC<WarningSectionProps> = ({
  application,
  step: { key, state, description, title },
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      padding={4}
      marginBottom={2}
      borderColor={'red600'}
    >
      {/* Warning Icon */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        className={cn(styles.sectionNumber, styles.sectionNumberRequiresAction)}
      >
        <Icon color="white" size="small" icon="warning" />
      </Box>

      {/* Contents */}
      <Box
        alignItems="flexStart"
        display="flex"
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
      >
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Text variant="h3">
            {formatText(title, application, formatMessage)}
          </Text>
          <Text marginTop={1} variant="default">
            {formatText(description, application, formatMessage)}
          </Text>
          {key === 'picture' && (
            <Box marginTop={2}>
              <Bullets application={application} />{' '}
            </Box>
          )}
        </Box>
        <Box pointerEvents="none">
          <Tag variant="red">
            {formatText(
              coreMessages.tagsRequiresAction,
              application,
              formatMessage,
            )}
          </Tag>
        </Box>
      </Box>
    </Box>
  )
}

export default WarningSection
