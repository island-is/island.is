import React, { FC } from 'react'
import { Box, Tag, Stack, Text, Button } from '@island.is/island-ui/core'

interface Props {
  label: string
  tag: string
  title: string
  description: string
  url: string
  buttonText: string
}

const ExternalFormDirect: FC<Props> = ({
  label,
  tag,
  title,
  description,
  url,
  buttonText,
}) => {
  return (
    <>
      <Box paddingTop={15} paddingX={8} paddingBottom={8}>
        <Box display="flex" justifyContent="spaceBetween" marginBottom={6}>
          <div>{label}</div>
          <Tag variant="blueberry" outlined>
            {tag}
          </Tag>
        </Box>
        <Stack space={3}>
          <Text variant="h3" as="h3">
            {title}
          </Text>
          <Text>{description}</Text>
        </Stack>
      </Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        padding={8}
        background="blue100"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button icon="open">{buttonText}</Button>
        </a>
      </Box>
    </>
  )
}

export default ExternalFormDirect
