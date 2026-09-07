import type { FC, PropsWithChildren, ReactElement } from 'react'

import { Box } from '@island.is/island-ui/core'
import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import ContextMenu from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import IconButton from '@island.is/judicial-system-web/src/components/IconButton/IconButton'

interface ContextMenuCardProps {
  title: ReactElement | string
  contextMenuItems?: ContextMenuItem[]
  // Accessible name for the icon-only context menu button.
  menuLabel: string
}

const ContextMenuCard: FC<PropsWithChildren<ContextMenuCardProps>> = (
  props,
) => {
  const { title, contextMenuItems, menuLabel, children } = props

  return (
    <BlueBox>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={2}
      >
        {title}
        <ContextMenu
          placement="left-start"
          shift={-12}
          items={contextMenuItems ?? []}
          render={
            <IconButton
              icon="ellipsisVertical"
              colorScheme="transparent"
              ariaLabel={menuLabel}
              disabled={!contextMenuItems || contextMenuItems.length === 0}
              onClick={(evt) => {
                evt.stopPropagation()
              }}
            />
          }
        />
      </Box>
      {children}
    </BlueBox>
  )
}

export default ContextMenuCard
