import React from 'react'

import { Box, FocusableBox, Tag, Text } from '@island.is/island-ui/core'
import { EnhancedAsset } from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

const getFileEnding = (url: string): string | undefined => {
  const lastChunk = url.split('/').pop()
  const filenameChunks = lastChunk?.split('.')
  if (filenameChunks?.length === 1) return ''
  return filenameChunks?.pop()
}

interface PublishedMaterialItemProps {
  item: EnhancedAsset
}

export const PublishedMaterialItem = ({ item }: PublishedMaterialItemProps) => {
  const { format } = useDateUtils()
  const fileEnding = getFileEnding(item.file?.url ?? '')
  const date =
    item.releaseDate && format(new Date(item.releaseDate), 'do MMMM yyyy')

  return (
    <FocusableBox
      width="full"
      padding={[2, 2, 3]}
      href={
        item.file?.url?.startsWith('//')
          ? `https:${item.file.url}`
          : item.file?.url
      }
      border="standard"
      borderRadius="large"
      display="flex"
      flexDirection="row"
    >
      <Box position="relative" width="full">
        <Box>
          <Text variant="h4" as="span" color="dark400">
            {item.title}
          </Text>
          <Text>{item.description}</Text>
        </Box>
        {date && (
          <Box marginTop={1}>
            <Text variant="eyebrow" color="dark300">
              {date}
            </Text>
          </Box>
        )}
      </Box>
      {fileEnding && (
        <Box
          display="flex"
          alignItems="center"
          marginLeft="auto"
          paddingLeft={2}
        >
          <Tag disabled={true} outlined={true}>
            {fileEnding}
          </Tag>
        </Box>
      )}
    </FocusableBox>
  )
}

export default PublishedMaterialItem
