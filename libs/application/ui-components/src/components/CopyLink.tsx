import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import copyToClipboard from 'copy-to-clipboard'

interface CopyLinkProps {
  linkUrl: string
  buttonTitle?: string
}

const CopyLink: FC<CopyLinkProps> = ({
  linkUrl,
  buttonTitle = 'Afrita tengil',
}) => {
  return (
    <Box
      background="blue100"
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      padding={3}
      borderRadius="large"
    >
      <Text variant="h5" color="blue400">
        {linkUrl}
      </Text>
      <Box>
        <Button
          onClick={() => copyToClipboard(linkUrl)}
          type="button"
          variant="text"
          nowrap
        >
          {buttonTitle}
        </Button>
      </Box>
    </Box>
  )
}

export default CopyLink
