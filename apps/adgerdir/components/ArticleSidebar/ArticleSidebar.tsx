/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import {
  Box,
  Typography,
  Stack,
  Divider,
  BoxProps,
} from '@island.is/island-ui/core'

interface ArticleSidebarProps {
  title?: string
  background?: BoxProps['background']
}

export const ArticleSidebar: FC<ArticleSidebarProps> = ({
  title,
  background = 'red100',
  children,
}) => {
  return (
    <Box background={background} borderRadius="large" padding={4}>
      <Stack space={[1, 1, 2]}>
        {title ? (
          <Typography variant="h4" as="h4" color="red600">
            {title}
          </Typography>
        ) : null}
        {title && children ? <Divider weight="red200" /> : null}
        {children}
      </Stack>
    </Box>
  )
}

export default ArticleSidebar
