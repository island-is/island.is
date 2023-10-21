import React, { FC } from 'react'
import {
  Box,
  BoxProps,
  ResponsiveSpace,
  ContentBlock,
} from '@island.is/island-ui/core'

export const simpleSpacing = [2, 2, 3] as ResponsiveSpace

export const ContentContainer: FC<React.PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => (
  <Box paddingX={[3, 3, 6, 0]} marginTop={simpleSpacing} {...props}>
    <ContentBlock width="small">{children}</ContentBlock>
  </Box>
)

export default ContentContainer
