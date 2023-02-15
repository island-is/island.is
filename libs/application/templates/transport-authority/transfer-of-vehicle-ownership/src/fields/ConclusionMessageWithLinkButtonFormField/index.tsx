import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { conclusion } from '../../lib/messages'

export const ConclusionMessageWithLinkButtonFormField: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      borderRadius="standard"
      padding={4}
      background="blue100"
      display="flex"
      alignItems="center"
      flexDirection={['column', 'column', 'row']}
      marginY={2}
    >
      <Box paddingRight={[0, 0, 4]}>
        <Text variant="small">
          {formatMessage(conclusion.default.servicePortalMessage)}
        </Text>
      </Box>
      <Box marginTop={[2, 2, 0]} marginLeft={[0, 0, 3]}>
        <Button
          onClick={() => {
            window.open(
              `${window.location.origin}/minarsidur/umsoknir#${application.id}`,
              '_blank',
            )
          }}
          size="small"
          icon="arrowForward"
        >
          {formatMessage(conclusion.default.servicePortalButtonTitle)}
        </Button>
      </Box>
    </Box>
  )
}
