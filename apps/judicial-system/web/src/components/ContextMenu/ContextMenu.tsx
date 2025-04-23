import { cloneElement, FC, forwardRef, ReactElement, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { useRouter } from 'next/router'
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
  // Menu items
  items: ContextMenuItem[]

  // Text in the menu button
  title?: string

  // Custom element to be used as the menu button
  render?: ReactElement
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

export const ContextMenu = forwardRef<HTMLButtonElement, ContextMenuProps>(
  ({ render, items, title }, ref) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const menu = useMenuStore({ open, setOpen })

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
      borderRadius: 'large',
      zIndex: 10,
      marginTop: 1,
    })

    const handleClick = (evt: React.MouseEvent, item: ContextMenuItem) => {
      evt.stopPropagation()
      setOpen(false)

      if (item.href) {
        router.push(item.href)
        return
      }

      if (item.onClick) {
        item.onClick()
        return
      }
    }

    return (
      <MenuProvider>
        <MenuButton
          render={render ?? <Button icon="add" />}
          store={menu}
          ref={ref}
        >
          {render ? null : title}
        </MenuButton>
        <Menu
          render={<ul className={cn(styles.menu, menuBoxStyle)} />}
          store={menu}
          unmountOnHide
        >
          {items?.map((item, index) => (
            <MenuItem
              key={`${item.title}_${index}`}
              render={
                <Box component="li" width="full">
                  <Box
                    component={item.href ? 'a' : 'button'}
                    href={item.href ?? undefined}
                    onClick={(evt) => handleClick(evt, item)}
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
