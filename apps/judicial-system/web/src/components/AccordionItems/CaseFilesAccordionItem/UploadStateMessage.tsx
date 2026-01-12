import { motion } from 'motion/react'

import { Box, Icon, IconMapIcon, Text } from '@island.is/island-ui/core'
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
      <Box
        display="flex"
        alignItems="center"
        marginLeft={4}
        data-testid={'upload-state-message'}
      >
        <Box display="flex" marginRight={1}>
          <Icon icon={icon} type="outline" color={iconColor} />
        </Box>
        <Text as="span" variant="h5">
          {message}
        </Text>
      </Box>
    </motion.span>
  )
}
