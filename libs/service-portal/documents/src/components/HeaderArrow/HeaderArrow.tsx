import React, { FC, ReactNode } from 'react'
import { Box, Button, Icon } from '@island.is/island-ui/core'

interface Props {
  direction?: 'asc' | 'desc'
  active?: boolean
  onClick?: () => void
  children?: ReactNode
}

export const HeaderArrow: FC<Props> = ({
  onClick,
  direction,
  children,
  active,
}) => {
  return (
    <Button variant="text" size="small" onClick={onClick}>
      <Box display="flex" flexDirection="row" alignItems="center">
        {children}
        {active && (
          <Box marginLeft="p1" display="flex">
            {direction === 'asc' && (
              <Icon color="dark400" icon="chevronUp" size="small" />
            )}
            {direction === 'desc' && (
              <Icon color="dark400" icon="chevronDown" size="small" />
            )}
          </Box>
        )}
      </Box>
    </Button>
  )
}

export default HeaderArrow
