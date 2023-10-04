import React from 'react'

import { Box, Icon, IconMapIcon, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

interface Props {
  icon: IconMapIcon
  iconColor: Colors
  message: string
}

const IconAndText: React.FC<Props> = (props) => {
  const { icon, iconColor, message } = props

  return (
    <Box display="flex" alignItems="center" paddingY={1}>
      <Box display="flex" marginRight={1}>
        <Icon icon={icon} color={iconColor} size="large" />
      </Box>
      <Text variant="h5">{message}</Text>
    </Box>
  )
}

export default IconAndText
