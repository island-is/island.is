import {
  ButtonProps,
  getTextStyles,
  useBoxStyles,
  Button,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import { ReactElement } from 'react'
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
  MenuStateReturn,
} from 'reakit/Menu'

import * as styles from './DropdownSort.css'

export interface DropdownMenuProps {
  menuAriaLabel?: string
  items: {
    onClick?: (menu: MenuStateReturn) => void
    title: string
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
  title?: string
  icon?: ButtonProps['icon']
}

const DropdownSort = ({
  menuAriaLabel,
  items,
  title,
  icon,
}: DropdownMenuProps) => {
  const menu = useMenuState({ placement: 'bottom', gutter: 8 })
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
      <MenuButton fluid as={Button} variant="utility" icon={icon} {...menu}>
        {title}
      </MenuButton>
      <Menu
        {...menu}
        aria-label={menuAriaLabel}
        className={cn(styles.menu, menuBoxStyle)}
      >
        {items.map((item, index) => {
          const render = item.render || ((i: ReactElement, _) => i)
          const classNames = cn(
            menuItemBoxStyle,
            menuItemTextStyle,
            styles.menuItem,
          )
          return render(
            <MenuItem
              {...menu}
              key={index}
              onClick={() => {
                if (item.onClick) {
                  item.onClick(menu)
                }
              }}
              className={classNames}
            >
              {item.title}
            </MenuItem>,
            index,
            classNames,
          )
        })}
      </Menu>
    </>
  )
}

export default DropdownSort
