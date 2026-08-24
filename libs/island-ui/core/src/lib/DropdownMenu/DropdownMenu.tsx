import cn from 'classnames'
import React, { MouseEvent, ReactElement, useId } from 'react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuStateReturn,
  useMenuState,
} from 'reakit/Menu'
import { useBoxStyles } from '../Box/useBoxStyles'
import { Button } from '../Button/Button'
import { ButtonProps } from '../Button/types'
import { getTextStyles } from '../Text/Text'

import * as styles from './DropdownMenu.css'
import { useMenuHoverProps } from './useMenuHoverProps'
import { Icon } from '../IconRC/Icon'
import { Box } from '../Box/Box'

export interface DropdownMenuProps {
  /**
   * Aria label for menu
   */
  menuLabel?: string
  items: {
    href?: string
    onClick?: (event: MouseEvent<HTMLElement>, menu: MenuStateReturn) => void
    title: string
    noStyle?: boolean
    icon?: ButtonProps['icon']
    iconType?: ButtonProps['iconType']
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
  /**
   * Utility button text
   */
  title?: string
  /**
   * Utility button icon
   */
  icon?: ButtonProps['icon']
  iconType?: ButtonProps['iconType']
  disclosure?: ReactElement
  menuClassName?: string
  fixed?: boolean
  openOnHover?: boolean
  loading?: boolean
  disabled?: boolean
}

export const DropdownMenu = ({
  menuLabel,
  items,
  title,
  icon,
  iconType,
  loading,
  disabled,
  disclosure,
  menuClassName,
  fixed = false,
  openOnHover = false,
}: DropdownMenuProps) => {
  // reakit defaults to a random baseId, which differs between server and
  // client and trips React's hydration mismatch check — derive it from
  // React's SSR-stable useId instead.
  const baseId = `dropdown-menu-${useId().replace(/\W/g, '')}`
  const menu = useMenuState({
    baseId,
    placement: 'bottom',
    gutter: 8,
    unstable_fixed: fixed,
  })

  const hoverProps = useMenuHoverProps(menu, openOnHover)
  const menuBoxStyle = useBoxStyles({
    component: 'div',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'large',
  })
  const menuItemBoxStyle = useBoxStyles({
    component: 'button',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    cursor: 'pointer',
    width: 'full',
  })
  const menuItemTextStyle = getTextStyles({
    variant: 'eyebrow',
  })
  return (
    <>
      {disclosure ? (
        // reakit's types don't model this disclosure render-prop pattern; the
        // `as any` casts keep it compiling. Remove when this migrates to ariakit.
        <MenuButton {...menu} {...(disclosure.props as any)} {...hoverProps}>
          {
            ((disclosureProps: any) =>
              React.cloneElement(disclosure, disclosureProps)) as any
          }
        </MenuButton>
      ) : (
        <MenuButton
          as={Button}
          variant="utility"
          icon={icon}
          iconType={iconType}
          loading={loading}
          disabled={disabled}
          {...menu}
          {...hoverProps}
        >
          {title}
        </MenuButton>
      )}
      <Menu
        {...menu}
        aria-label={menuLabel}
        className={cn(styles.menu, menuBoxStyle, menuClassName)}
        {...hoverProps}
        // Hover menus shouldn't yank focus back to the disclosure when they
        // close. Menu (a Dialog) consumes this option; the disclosure button
        // doesn't, so it must not go into the shared hoverProps spread.
        unstable_autoFocusOnHide={!openOnHover}
      >
        {items.map((item, index) => {
          let anchorProps = {}
          const render = item.render || ((i: ReactElement, _) => i)
          if (item.href) {
            anchorProps = {
              href: item.href,
              as: 'a',
            }
          }
          const classNames = cn(
            menuItemBoxStyle,
            menuItemTextStyle,
            styles.menuItem,
          )
          return render(
            <MenuItem
              {...menu}
              {...anchorProps}
              key={index}
              onClick={(event) => {
                if (item.onClick) {
                  item.onClick(event, menu)
                }
              }}
              className={cn({ [classNames]: !item.noStyle })}
            >
              {item.icon ? (
                <Box
                  display="flex"
                  alignItems="center"
                  width="full"
                  marginRight={2}
                >
                  <Box
                    marginX={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      icon={item.icon}
                      type={item.iconType}
                      size="small"
                      color="blue400"
                    />
                  </Box>

                  {item.title}
                </Box>
              ) : (
                item.title
              )}
            </MenuItem>,
            index,
            classNames,
          )
        })}
      </Menu>
    </>
  )
}

export default DropdownMenu
