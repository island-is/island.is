import React from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'

export interface TwoColumnTextProps {
  leftTitle: string
  leftContent: SliceType[]
  leftLink: {
    url: string
    text: string
  }
  rightTitle: string
  rightContent: SliceType[]
  rightLink: {
    url: string
    text: string
  }
}

export const TwoColumnText: React.FC<TwoColumnTextProps> = ({
  leftTitle,
  leftContent,
  leftLink,
  rightTitle,
  rightContent,
  rightLink,
}) => {
  return (
    <Box
      borderTopWidth="standard"
      borderColor="standard"
      paddingTop={[4, 4, 6]}
      paddingBottom={[4, 5, 10]}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={2}>
          <Text variant="h3" as="h2">
            {leftTitle}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={2}>
          {rightTitle && (
            <Text variant="h3" as="h2">
              {rightTitle}
            </Text>
          )}
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          {richText(leftContent)}
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          {richText(rightContent)}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
