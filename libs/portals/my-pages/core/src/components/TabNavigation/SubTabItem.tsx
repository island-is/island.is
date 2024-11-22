import { Text } from '@island.is/island-ui/core'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import * as styles from './SubTabItem.css'
import cn from 'classnames'
import { Ref, forwardRef } from 'react'

export interface SubTabItemProps {
  id: string
  active?: boolean
  isPrevTabToActive?: boolean
  isNextTabToActive?: boolean
  onClick: () => void
  onKeyDown: (code: string) => void
  name: string
  ref?: Ref<HTMLElement>
}

export const SubTabItem = forwardRef<HTMLElement, SubTabItemProps>(
  ({ active = false, onClick, isPrevTabToActive, onKeyDown, name }, ref) => (
    <FocusableBox
      component="button"
      borderRadius="xs"
      aria-selected={active}
      role="tab"
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => onKeyDown(e.code)}
      ref={ref}
      background={active ? 'white' : 'transparent'}
      justifyContent="center"
      alignItems="center"
      className={cn(styles.subTabItem, {
        [styles.activeSubTabItem]: active,
        [styles.inactiveSubTabItem]: !active,
        [styles.inactiveSubTabItemWithDivider]: !active && !isPrevTabToActive,
      })}
    >
      <Text
        fontWeight={active ? 'semiBold' : 'light'}
        variant="medium"
        color={active ? 'blue400' : 'black'}
      >
        {name}
      </Text>
    </FocusableBox>
  ),
)
