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
    <GridRow>
      <GridColumn span={['1/1', '10/12']} offset={['0', '0']} order={[2, 1]}>
        <Box
          marginTop={[0, 6]}
          marginBottom={[0, 6]}
          textAlign="center"
          justifyContent="center"
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
      </GridColumn>
      {figure && (
        <GridColumn
          span={['1/1', '4/12']}
          offset={['0', '3/12']}
          order={[1, 2]}
        >
          <Box display="flex" justifyContent="center" marginBottom={[1, 0]}>
            <img
              src={figure}
              alt={`${formatMessage(m.altText)} ${title}`}
              className={styles.img}
            />
          </Box>
        </GridColumn>
      )}
    </GridRow>
  )
}
