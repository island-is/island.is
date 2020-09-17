import React, { FC } from 'react'
import { Box, Tag, Stack, Typography, Button } from '@island.is/island-ui/core'

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
          <Tag variant="darkerMint">{tag}</Tag>
        </Box>
        <Stack space={3}>
          <Typography variant="h3">{title}</Typography>
          <Typography variant="p">{description}</Typography>
        </Stack>
      </Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        padding={8}
        background="blue100"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button icon="external">{buttonText}</Button>
        </a>
      </Box>
    </>
  )
}

export default ExternalFormDirect
