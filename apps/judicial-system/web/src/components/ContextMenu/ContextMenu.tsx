import React, { forwardRef, ReactElement } from 'react'
import cn from 'classnames'
import { Menu, MenuButton, MenuItem, useMenuState } from 'reakit/Menu'

import {
  Box,
  Button,
  getTextStyles,
  Icon,
  IconMapIcon,
  useBoxStyles,
} from '@island.is/island-ui/core'

import * as styles from './ContextMenu.css'

export interface DropdownMenuProps {
  // Aria label for menu
  menuLabel: string

  // Menu items
  items: {
    href?: string
    onClick?: () => void
    title: string
    icon?: IconMapIcon
  }[]

  // Text in the menu button
  title?: string

  // Custom element to be used as the menu button
  disclosure?: ReactElement
}

const ContextMenu = forwardRef<HTMLElement, DropdownMenuProps>(
  ({ disclosure, menuLabel, items, title }, ref) => {
    const menu = useMenuState({
      placement: 'bottom-end',
      unstable_offset: [0, 4],
    })

    const menuBoxStyle = useBoxStyles({
      component: 'div',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'large',
      zIndex: 10,
    })

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

    return (
      <>
        {disclosure ? (
          <MenuButton ref={ref} {...menu} {...disclosure.props}>
            {(disclosureProps) =>
              React.cloneElement(disclosure, disclosureProps)
            }
          </MenuButton>
        ) : (
          <MenuButton as={Button} variant="utility" icon="add" {...menu}>
            {title}
          </MenuButton>
        )}
        <Menu
          {...menu}
          aria-label={menuLabel}
          className={cn(styles.menu, menuBoxStyle)}
        >
          {items.map((item, index) => {
            let anchorProps = {}
            if (item.href) {
              anchorProps = {
                href: item.href,
                as: 'a',
              }
            }
            return (
              <MenuItem
                {...menu}
                {...anchorProps}
                key={`${item.title}_${index}`}
                onClick={(evt) => {
                  evt.stopPropagation()
                  menu.hide()
                  if (item.onClick) {
                    item.onClick()
                  }
                }}
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
              </MenuItem>
            )
          })}
        </Menu>
      </>
    )
  },
)

export default ContextMenu
