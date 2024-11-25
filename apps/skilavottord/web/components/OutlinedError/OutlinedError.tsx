import React, { FC } from 'react'
import { Box, Button, Icon, Stack, Text } from '@island.is/island-ui/core'

interface OutlinedErrorProps {
  title: string
  message: string
  primaryButton: Button
  secondaryButton?: Button
}

interface Button {
  text: string
  action: () => void
}

export const OutlinedError: FC<React.PropsWithChildren<OutlinedErrorProps>> = ({
  title,
  message,
  primaryButton,
  secondaryButton,
}: OutlinedErrorProps) => {
  return (
    <Box>
      <Stack space={4}>
        <Stack space={[3, 3, 2, 2]}>
          <Box
            display="flex"
            background="red100"
            borderColor="red200"
            border="standard"
            paddingY={2}
            paddingLeft={2}
            paddingRight={[3, 3, 3, 2]}
            borderRadius="large"
          >
            <Box flexShrink={0} marginRight={[1, 1, 1, 2]}>
              <Icon icon="warning" color="red400" size="large" />
            </Box>
            <Box>
              <Text variant="h5">{title}</Text>
              <Text>{message}</Text>
            </Box>
          </Box>
        </Stack>
        <Box display="flex" justifyContent="spaceBetween">
          {secondaryButton && (
            <Button variant="ghost" onClick={secondaryButton.action}>
              {secondaryButton.text}
            </Button>
          )}
          <Button
            variant={secondaryButton ? 'primary' : 'ghost'}
            onClick={primaryButton.action}
          >
            {primaryButton.text}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
export default OutlinedError
