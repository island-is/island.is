import { FC, PropsWithChildren, ReactElement } from 'react'

import { Box } from '@island.is/island-ui/core'

import BlueBox from '../BlueBox/BlueBox'
import ContextMenu, { ContextMenuItem } from '../ContextMenu/ContextMenu'
import IconButton from '../IconButton/IconButton'

interface BlueBoxWithContextMenuProps {
  title: ReactElement | string
  contextMenuItems?: ContextMenuItem[]
}

const BlueBoxWithContextMenu: FC<
  PropsWithChildren<BlueBoxWithContextMenuProps>
> = (props) => {
  const { title, contextMenuItems, children } = props

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

export default BlueBoxWithContextMenu
