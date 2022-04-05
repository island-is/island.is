import React from 'react'
import { Box, FocusableBox, Text, Tag } from '@island.is/island-ui/core'
import { EnhancedAsset } from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

interface PublishedMaterialItemProps {
  item: EnhancedAsset
}

export const PublishedMaterialItem = ({ item }: PublishedMaterialItemProps) => {
  const { format } = useDateUtils()
  const fileEnding = item.file?.url.split('.').pop().toUpperCase()
  const date =
    item?.releaseDate && format(new Date(item.releaseDate), 'do MMMM yyyy')
  return (
    <FocusableBox
      width="full"
      padding={[2, 2, 3]}
      href={
        item.file.url.startsWith('//')
          ? `https:${item.file.url}`
          : item.file.url
      }
      border="standard"
      borderRadius="large"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" display="flex" width="full">
        <Box>
          <Text variant="h4" as="span" color="dark400">
            {item.title}
          </Text>
          <Text>{item.description}</Text>
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
      </Box>
      {date && (
        <Text variant="eyebrow" color="dark300">
          {date}
        </Text>
      )}
    </FocusableBox>
  )
}

export default PublishedMaterialItem
