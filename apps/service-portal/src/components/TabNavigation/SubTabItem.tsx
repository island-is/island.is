import React from 'react'
import { Box, Button, ResponsiveSpace } from '@island.is/island-ui/core'

interface Props {
  onClick?: () => void
  colorScheme: 'default' | 'light'
  title: string
  marginLeft?: ResponsiveSpace
}

export const SubTabItem: React.FC<Props> = ({
  onClick,
  colorScheme,
  title,
  marginLeft = 2,
}) => {
  return (
    <Box marginLeft={marginLeft}>
      <Button
        type="button"
        aria-label={title}
        size="small"
        colorScheme={colorScheme}
        onClick={onClick}
      >
        {title}
      </Button>
    </Box>
  )
}
