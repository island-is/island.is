import { FocusableBox } from '../FocusableBox/FocusableBox'
import cn from 'classnames'
import * as styles from './TabItem.css'
import { Ref, forwardRef } from 'react'

export interface TabItemProps {
  id: string
  active?: boolean
  isLastTab?: boolean
  isFirstTab?: boolean
  isPrevTabToActive?: boolean
  isNextTabToActive?: boolean
  onClick: () => void
  onKeyDown: (code: string) => void
  name: string
  ref?: Ref<HTMLElement>
}

export const TabItem = forwardRef<HTMLElement, TabItemProps>(
  (
    {
      id,
      active = false,
      onClick,
      isPrevTabToActive,
      isNextTabToActive,
      onKeyDown,
      name,
    },
    ref,
  ) => (
    <FocusableBox
      key={id}
      component={'button'}
      display="flex"
      tabIndex={active ? 0 : -1}
      role="tab"
      id={id}
      aria-selected={active}
      onClick={onClick}
      onKeyDown={(e) => onKeyDown(e.code)}
      ref={ref}
      className={cn(styles.tab, {
        [styles.tabSelected]: active,
        [styles.tabNotSelected]:
          !active && !isPrevTabToActive && !isNextTabToActive,
        [styles.tabPreviousToSelectedTab]: isPrevTabToActive,
        [styles.tabNextToSelectedTab]: isNextTabToActive,
      })}
    >
      <div className={styles.borderElement} />
      <div className={styles.tabElement} />
      <span className={cn({ [styles.tabText]: active })}>{name}</span>
    </FocusableBox>
  ),
)
