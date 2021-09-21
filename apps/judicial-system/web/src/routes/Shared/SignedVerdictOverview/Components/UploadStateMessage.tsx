import React from 'react'
import { motion } from 'framer-motion'
import { Box, Icon, Text, IconMapIcon } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

interface Props {
  icon: IconMapIcon
  iconColor: Colors
  message: string
}

export const UploadStateMessage = (props: Props) => {
  const { icon, iconColor, message } = props

  return (
    <motion.span
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
    >
      <Box display="flex" alignItems="center" marginLeft={2}>
        <Box display="flex" marginRight={1}>
          <Icon icon={icon} type="outline" color={iconColor} />
        </Box>
        <Text as="span">{message}</Text>
      </Box>
    </motion.span>
  )
}
