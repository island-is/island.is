import { forwardRef, ReactElement, useState } from 'react'
import cn from 'classnames'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuProvider,
  useMenuStore,
} from '@ariakit/react'

import {
  Box,
  Button,
  getTextStyles,
  Icon,
  IconMapIcon,
  useBoxStyles,
} from '@island.is/island-ui/core'

import * as styles from './ContextMenu.css'

export interface ContextMenuItem {
  href?: string
  onClick?: () => void
  title: string
  icon?: IconMapIcon
}

export type MenuItems = ContextMenuItem[]

/** Placement of the menu relative to the trigger (Ariakit popover placement). Default: bottom-start */
export type ContextMenuPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

interface ContextMenuProps {
  // Menu items
  items: ContextMenuItem[]

  // Text in the menu button
  title?: string

  // Custom element to be used as the menu button
  render?: ReactElement

  // Where the menu is positioned relative to the trigger (default: bottom-start)
  placement?: ContextMenuPlacement

  // Gap between the menu and the trigger in px (default: 8). Use 0 for flush alignment.
  gutter?: number

  // Skidding along the anchor (e.g. for left placement: negative = up, positive = down)
  shift?: number
}

const DEFAULT_GUTTER = 8

export const ContextMenu = forwardRef<HTMLButtonElement, ContextMenuProps>(
  (
    {
      render,
      items,
      title,
      placement = 'bottom-start',
      gutter = DEFAULT_GUTTER,
      shift,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const menu = useMenuStore({ open, setOpen, placement })

    const menuItemBoxStyle = useBoxStyles({
      component: 'button',
      display: 'flex',
      alignItems: 'center',
      width: 'full',
      padding: 2,
      cursor: 'pointer',
    })

    const menuItemTextStyle = getTextStyles({
      variant: 'default',
    })

    const menuBoxStyle = useBoxStyles({
      component: 'div',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'lg',
      zIndex: 10,
    })

    const handleClick = (evt: React.MouseEvent, item: ContextMenuItem) => {
      evt.stopPropagation()

      setOpen(false)
      setIsLoading(true)

      if (item.onClick) {
        item.onClick()
        setIsLoading(false)

        return
      }
    }

    return (
      <MenuProvider>
        <MenuButton
          render={render ?? <Button icon="add" loading={isLoading} />}
          store={menu}
          ref={ref}
        >
          {render ? null : title}
        </MenuButton>
        <Menu
          render={<ul className={cn(styles.menu, menuBoxStyle)} />}
          store={menu}
          gutter={gutter}
          shift={shift}
          unmountOnHide
        >
          {items?.map((item, index) => (
            <MenuItem
              key={`${item.title}_${index}`}
              render={
                <Box component="li" width="full">
                  <Box
                    component={item.href ? 'a' : 'button'}
                    onClick={
                      item.href ? undefined : (evt) => handleClick(evt, item)
                    }
                    href={item.href ?? undefined}
                    className={cn(
                      menuItemBoxStyle,
                      menuItemTextStyle,
                      styles.menuItem,
                    )}
                  >
                    {item.icon && (
                      <Box display="flex" marginRight={2}>
                        <Icon icon={item.icon} type="outline" color="blue400" />
                      </Box>
                    )}
                    {item.title}
                  </Box>
                </Box>
              }
            />
          ))}
        </Menu>
      </MenuProvider>
    )
  },
)

export default ContextMenu
