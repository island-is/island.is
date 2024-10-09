import React, { FC } from 'react'
import { Box, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import * as styles from './ErrorScreen.css'

interface Props {
  title: string
  children?: React.ReactNode
  tag: string
  tagVariant?: TagVariant
  figure?: string
}

export const ErrorScreen: FC<React.PropsWithChildren<Props>> = ({
  title,
  tag,
  figure,
  children,
  tagVariant = 'purple',
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        marginY={6}
        textAlign="center"
        justifyContent="center"
        className={styles.errorScreenTextContainer}
      >
        <Box marginBottom={4}>
          <Tag variant={tagVariant}>{tag}</Tag>
        </Box>
        <Text variant="h1" as="h1" marginBottom={3}>
          {title}
        </Text>
        <Text variant="default" as="p">
          {children}
        </Text>
      </Box>

      {figure && (
        <Box display="flex" justifyContent="center">
          <img src={figure} alt="" className={styles.img} />
        </Box>
      )}
    </Box>
  )
}
