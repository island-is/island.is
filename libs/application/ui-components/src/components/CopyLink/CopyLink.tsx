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
      <Box style={{ overflowWrap: 'anywhere' }} paddingRight={4}>
        <Text color="blue400">{linkUrl}</Text>
      </Box>
      <Box>
        <Button
          onClick={() => copyToClipboard(linkUrl)}
          variant="ghost"
          nowrap
          colorScheme="light"
          icon="copy"
          iconType="outline"
          size="small"
        >
          {buttonTitle}
        </Button>
      </Box>
    </Box>
  )
}

export default CopyLink
