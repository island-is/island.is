import { cloneElement, forwardRef, ReactElement } from 'react'
import { useIntl } from 'react-intl'
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
import { TestSupport } from '@island.is/island-ui/utils'

import { useCaseList } from '../../utils/hooks'
import { contextMenu as strings } from './ContextMenu.strings'
import * as styles from './ContextMenu.css'

export interface ContextMenuItem {
  href?: string
  onClick?: () => void
  title: string
  icon?: IconMapIcon
}

export type MenuItems = ContextMenuItem[]

interface ContextMenuProps {
  // Aria label for menu
  menuLabel: string

  // Menu items
  items: ContextMenuItem[]

  // Text in the menu button
  title?: string

  // Custom element to be used as the menu button
  disclosure?: ReactElement

  // Space between menu and button
  offset?: [string | number, string | number]
}

export const useContextMenu = () => {
  const { handleOpenCase } = useCaseList()
  const { formatMessage } = useIntl()

  const openCaseInNewTabMenuItem = (id: string): ContextMenuItem => {
    return {
      title: formatMessage(strings.openInNewTab),
      onClick: () => handleOpenCase(id, true),
      icon: 'open',
    }
  }

  return {
    openCaseInNewTabMenuItem,
  }
}

const ContextMenu = forwardRef<HTMLElement, ContextMenuProps & TestSupport>(
  ({ disclosure, menuLabel, items, title, dataTestId, offset }, ref) => {
    const menu = useMenuState({
      placement: 'bottom-end',
      unstable_offset: offset ?? [0, 4],
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
          <MenuButton
            ref={ref}
            {...menu}
            {...disclosure.props}
            dataTestId={dataTestId}
          >
            {(disclosureProps) => cloneElement(disclosure, disclosureProps)}
          </MenuButton>
        ) : (
          <MenuButton as={Button} icon="add" {...menu} dataTestId={dataTestId}>
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
