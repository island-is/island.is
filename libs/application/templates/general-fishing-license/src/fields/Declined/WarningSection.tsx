import { formatText, coreMessages } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import * as styles from './WarningSection.css'

interface Step {
  title: string
  description: string
}

type WarningSectionProps = {
  application: Application
  step: Step
}

export const WarningSection: FC<
  React.PropsWithChildren<WarningSectionProps>
> = ({ application, step: { description, title } }) => {
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        borderRadius="circle"
        background="red600"
        color="red600"
        className={styles.sectionNumber}
      >
        <Icon color="white" size="small" icon="warning" />
      </Box>
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
