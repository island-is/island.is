import React, { FC } from 'react'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Box, Button, Text } from '@island.is/island-ui/core'
import copyToClipboard from 'copy-to-clipboard'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface CopyLinkProps {
  linkUrl: string
  fieldDescription: string
}

const CopyLink: FC<CopyLinkProps> = ({ linkUrl, fieldDescription }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <FieldDescription description={fieldDescription} />
      <Box
        background="blue100"
        display="flex"
        justifyContent="spaceBetween"
        padding={3}
        marginTop={3}
        marginBottom={5}
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
            {formatMessage(m.recommendations.copyLinkButton)}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default CopyLink
