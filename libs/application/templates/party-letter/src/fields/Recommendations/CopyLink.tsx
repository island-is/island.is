import React, { FC } from 'react'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Box, Button, Text } from '@island.is/island-ui/core'
import copyToClipboard from 'copy-to-clipboard'

interface CopyLinkProps {
  linkUrl: string
  fieldDescription: string
}

const CopyLink: FC<CopyLinkProps> = ({ linkUrl, fieldDescription }) => {
  return (
    <>
      <FieldDescription description={fieldDescription} />
      <Box
        background="blue100"
        display="flex"
        justifyContent="spaceBetween"
        padding={3}
        marginY={3}
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
          >
            Afrita tengil
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default CopyLink
