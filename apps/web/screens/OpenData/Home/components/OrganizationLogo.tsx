import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'

interface OrganizationLogoProps {
  image?: string
  name: string
  size?: 'small' | 'medium'
}

export const OrganizationLogo: React.FC<OrganizationLogoProps> = ({
  image,
  name,
  size = 'small',
}) => {
  const dimensions = size === 'small' ? '40px' : '80px'

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        style={{
          width: dimensions,
          height: dimensions,
          objectFit: 'contain',
        }}
      />
    )
  }

  return (
    <Box
      background="blue100"
      borderRadius="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ width: dimensions, height: dimensions }}
    >
      <Text variant="small" color="blue400">
        {name?.charAt(0) || 'Ó'}
      </Text>
    </Box>
  )
}

export default OrganizationLogo
