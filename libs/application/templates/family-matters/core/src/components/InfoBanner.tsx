import React from 'react'
import { Box, Icon } from '@island.is/island-ui/core'

const InfoBanner = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      padding={2}
      borderRadius="default"
      background="blue100"
      borderColor="blue200"
      borderWidth="standard"
    >
      <Box display="flex" alignItems="flexStart">
        <Box display="flex" alignItems="center" marginRight={2} flexShrink={0}>
          <Icon type="filled" color="blue400" icon="informationCircle" />
        </Box>
        <Box>{children}</Box>
      </Box>
    </Box>
  )
}

export default InfoBanner
