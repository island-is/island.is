import cn from 'classnames'
import React, { MouseEvent, ReactElement } from 'react'
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
  const menu = useMenuState({
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
        <MenuButton {...menu} {...disclosure.props} {...hoverProps}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
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
