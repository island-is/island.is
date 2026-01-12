import React, { FC } from 'react'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import { MessageDescriptor } from '@formatjs/intl'

import * as styles from './WarningSection.css'

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

const WarningSection: FC<React.PropsWithChildren<WarningSectionProps>> = ({
  step: { description, title },
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
          <Text variant="h3">{formatMessage(title)}</Text>
          <Text marginTop={1} variant="default">
            {formatMessage(description)}
          </Text>
        </Box>
        <Box pointerEvents="none">
          <Tag variant="red">
            {formatMessage(coreMessages.tagsRequiresAction)}
          </Tag>
        </Box>
      </Box>
    </Box>
  )
}

export default WarningSection
