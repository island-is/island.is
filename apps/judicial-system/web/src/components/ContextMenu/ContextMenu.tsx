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
  // Aria label for menu
  menuLabel?: string

  // Menu items
  items?: ContextMenuItem[]

  // Text in the menu button
  title?: string

  // Custom element to be used as the menu button
  disclosure?: ReactElement

  render?: ReactElement

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

export const ContextMenuV2 = forwardRef<
  HTMLButtonElement,
  ContextMenuProps & TestSupport
>(({ render, menuLabel, items, title, dataTestId, offset }, ref) => {
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
    marginTop: 2,
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
        {title}
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
})

const ContextMenu = forwardRef<HTMLElement, ContextMenuProps & TestSupport>(
  ({ disclosure, menuLabel, items, title, dataTestId, offset }, ref) => {
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
        hekki
        {/* {disclosure ? (
          <MenuButton
            ref={ref}
            {...menu}
            {...disclosure.props}
            dataTestId={dataTestId}
          >
            {(disclosureProps: DisclosureProps) =>
              cloneElement(disclosure, disclosureProps)
            }
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
        </Menu> */}
      </>
    )
  },
)

export default ContextMenu
