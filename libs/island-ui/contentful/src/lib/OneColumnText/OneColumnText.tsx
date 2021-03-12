import React from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import { richText, SliceType } from '@island.is/island-ui/contentful'

export interface OneColumnTextProps {
  title: string
  content: SliceType[]
  link: {
    url: string
    text: string
  }
}

export const OneColumnText: React.FC<OneColumnTextProps> = ({
  title,
  content,
  link,
}) => {
  return (
    <Box
      borderTopWidth="standard"
      borderColor="standard"
      paddingTop={[4, 4, 6]}
      paddingBottom={[4, 5, 10]}
    >
      <Text variant="h3" as="h2" paddingBottom={2}>
        {title}
      </Text>
      {richText(content)}
      {link && (
        <Link href="#">
          <Button
            icon="arrowForward"
            iconType="filled"
            type="button"
            variant="text"
          >
            {link.text}
          </Button>
        </Link>
      )}
    </Box>
  )
}
