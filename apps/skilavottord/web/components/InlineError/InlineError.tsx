import React, { FC } from 'react'

import {
  Box,
  Button,
  IconDeprecated as Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'

export interface InlineErrorProps {
  title: string
  message: string
  primaryButton: Button
  secondaryButton?: Button
}

interface Button {
  text: string
  action: () => void
}

export const InlineError: FC<InlineErrorProps> = ({
  title,
  message,
  primaryButton,
  secondaryButton,
}: InlineErrorProps) => {
  return (
    <Box paddingBottom={10}>
      <Stack space={4}>
        <Stack space={[3, 3, 2, 2]}>
          <Text variant="h3">{title}</Text>
          <Box display="flex">
            <Box flexShrink={0} paddingRight={2}>
              <Icon type="alert" color="red400" />
            </Box>
            <Text>{message}</Text>
          </Box>
        </Stack>
        {secondaryButton && (
          <Button
            variant="ghost"
            colorScheme="destructive"
            onClick={secondaryButton.action}
          >
            {secondaryButton.text}
          </Button>
        )}
        <Button
          variant={secondaryButton ? 'primary' : 'ghost'}
          onClick={primaryButton.action}
        >
          {primaryButton.text}
        </Button>
      </Stack>
    </Box>
  )
}
export default InlineError
