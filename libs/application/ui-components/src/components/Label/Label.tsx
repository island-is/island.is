import React, { FC } from 'react'

import { ResponsiveProp, Space, Text } from '@island.is/island-ui/core'

interface LabelProps {
  marginTop?: ResponsiveProp<Space | 'auto'>
  marginBottom?: ResponsiveProp<Space | 'auto'>
}

export const Label: FC<React.PropsWithChildren<LabelProps>> = ({
  children,
  marginTop,
  marginBottom,
}) => (
  <Text variant="h4" as="h4" marginTop={marginTop} marginBottom={marginBottom}>
    {children}
  </Text>
)
