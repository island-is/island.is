import React, { FC } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'

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
  return (
    <GridRow>
      <GridColumn span={['1/1', '10/12']} offset={['0', '1/12']} order={[2, 1]}>
        <Box marginTop={12} marginBottom={6} textAlign="center">
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
          span={['12/12', '4/12']}
          offset={['0', '4/12']}
          order={[1, 2]}
        >
          <Box marginBottom={[3, 0]}>
            <img src={figure} alt={`skrautmynd fyrir ${title}`} />
          </Box>
        </GridColumn>
      )}
    </GridRow>
  )
}
