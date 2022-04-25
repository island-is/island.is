import React, { FC } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import * as styles from './ErrorScreen.css'

interface Props {
  title: string
  children?: React.ReactNode
  tag: string
  tagVariant?: TagVariant
  figure?: string
}

export const ErrorScreen: FC<Props> = ({
  title,
  tag,
  figure,
  children,
  tagVariant = 'purple',
}) => {
  const { formatMessage } = useLocale()
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
          <img
            src={figure}
            alt={`${formatMessage(m.altText)} ${title}`}
            className={styles.img}
          />
        </Box>
      )}
    </Box>
  )
}
