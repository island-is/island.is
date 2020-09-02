/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { Box, Typography, Stack, Divider } from '@island.is/island-ui/core'

interface ArticleSidebarProps {
  title: string
}

export const ArticleSidebar: FC<ArticleSidebarProps> = ({
  title,
  children,
}) => {
  return (
    <Box background="red100" borderRadius="large" padding={4}>
      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h4" color="red600">
          {title}
        </Typography>
        {children ? (
          <>
            <Divider weight="red200" />
            {children}
          </>
        ) : null}
      </Stack>
    </Box>
  )
}

export default ArticleSidebar
