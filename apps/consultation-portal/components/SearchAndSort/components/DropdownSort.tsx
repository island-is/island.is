import {
  ButtonProps,
  getTextStyles,
  useBoxStyles,
  Button,
} from '@island.is/island-ui/core'
import { SortOptions, SortOptionsAdvices } from '../../../types/enums'
import cn from 'classnames'
import { ReactElement } from 'react'
import { useMenuState, Menu, MenuItem, MenuButton } from 'reakit/Menu'

import * as styles from './DropdownSort.css'

interface DropdownMenuProps {
  menuAriaLabel?: string
  items: {
    title: SortOptions | SortOptionsAdvices
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
  title: SortOptions | SortOptionsAdvices
  icon?: ButtonProps['icon']
  setTitle: (newTitle: SortOptions | SortOptionsAdvices) => void
}

const DropdownSort = ({
  menuAriaLabel,
  items,
  title,
  icon,
  setTitle,
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
        {items?.map((item, index) => {
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
                setTitle(item.title)
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
