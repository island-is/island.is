import React from 'react'

import { Box, Icon, IconMapIcon, Inline, Text } from '@island.is/island-ui/core'

export interface SectionTitleProps {
  title: string
  icon: IconMapIcon
}

export const SectionTitle = ({ title, icon }: SectionTitleProps) => (
  <Box paddingBottom={4}>
    <Inline space={2} alignY="bottom">
      <Icon color="blue400" icon={icon} size="large" type="outline" />
      <Text variant="h3">{title}</Text>
    </Inline>
  </Box>
)

export default SectionTitle
