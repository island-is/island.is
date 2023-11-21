import React from 'react'
import { Menu, MenuButton, MenuItem, useMenuState } from 'reakit/Menu'

import {
  Button,
  ButtonProps,
  getTextStyles,
  useBoxStyles,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'

import * as styles from './DropdownMenu.css'

export interface DropdownMenuProps {
  /**
   * Aria label for menu
   */
  menuLabel?: string
  items: {
    href?: string
    onClick?: () => void
    title: string
  }[]
  /**
   * Utility button text
   */
  title?: string
  /**
   * Utility button icon
   */
  icon?: ButtonProps['icon']
}

export const DropdownMenu = ({
  menuLabel,
  items,
  title,
  icon,
  dataTestId,
}: DropdownMenuProps & TestSupport) => {
  const menu = useMenuState({
    placement: 'bottom-start',
    unstable_offset: [0, 8],
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
    width: 'full',
    paddingTop: 2,
    paddingRight: 3,
    paddingBottom: 2,
    paddingLeft: 3,
    cursor: 'pointer',
  })
  const menuItemTextStyle = getTextStyles({
    variant: 'default',
  })

  return (
    <>
      <MenuButton as={Button} icon={icon} {...menu} data-testid={dataTestId}>
        {title}
      </MenuButton>
      <Menu
        {...menu}
        aria-label={menuLabel}
        className={styles.menu + ' ' + menuBoxStyle}
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
              key={index}
              onClick={() => {
                menu.hide()
                if (item.onClick) {
                  item.onClick()
                }
              }}
              className={
                menuItemBoxStyle +
                ' ' +
                menuItemTextStyle +
                ' ' +
                styles.menuItem
              }
            >
              {item.title}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default DropdownMenu
