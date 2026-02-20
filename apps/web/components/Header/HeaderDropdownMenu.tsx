import React, { FC, ReactNode } from 'react'
import {
  Popover,
  PopoverDisclosure,
  usePopoverState,
} from 'reakit/Popover'
import { Box, Icon, Text } from '@island.is/island-ui/core'

import * as styles from './HeaderDropdownMenu.css'

interface HeaderDropdownMenuProps {
  label: string
  children: ReactNode
  menuLabel?: string
}

export const HeaderDropdownMenu: FC<HeaderDropdownMenuProps> = ({
  label,
  children,
  menuLabel,
}) => {
  const popover = usePopoverState({
    placement: 'bottom-start',
    gutter: 8,
  })

  return (
    <>
      <PopoverDisclosure {...popover} className={styles.disclosure}>
        <Box display="flex" alignItems="center">
          <Text variant="medium" fontWeight="semiBold">
            {label}
          </Text>
          <Box marginLeft={1} display="flex" alignItems="center">
            <Icon
              icon={popover.visible ? 'chevronUp' : 'chevronDown'}
              type="outline"
              size="small"
              color="blue400"
            />
          </Box>
        </Box>
      </PopoverDisclosure>
      <Popover
        {...popover}
        aria-label={menuLabel ?? label}
        className={styles.popover}
      >
        {children}
      </Popover>
    </>
  )
}
