import { FocusableBox, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './TabItem.css'
import { Ref, forwardRef } from 'react'

export interface TabItemProps {
  id: string
  active: boolean
  onClick: () => void
  onKeyDown: (code: string) => void
  name: string
  ref?: Ref<HTMLElement>
  variant?: 'default' | 'alternative'
}

export const TabItem = forwardRef<HTMLElement, TabItemProps>(
  ({ id, active, onClick, onKeyDown, name, variant }, ref) => {
    if (variant === 'alternative') {
      return (
        <FocusableBox
          component={'button'}
          borderRadius="standard"
          aria-selected={active}
          tabIndex={active ? 0 : -1}
          onClick={onClick}
          onKeyDown={(e) => onKeyDown(e.code)}
          ref={ref}
          background={active ? 'white' : 'transparent'}
          paddingX={3}
          paddingY={1}
          justifyContent="center"
          alignItems="center"
          className={styles.alternativeTabItem}
        >
          <Text
            fontWeight={active ? 'semiBold' : 'light'}
            variant="medium"
            color={active ? 'blue400' : 'black'}
          >
            {name}
          </Text>
        </FocusableBox>
      )
    }
    return (
      <FocusableBox
        component="button"
        key={id}
        display="flex"
        tabIndex={active ? 0 : -1}
        role="tab"
        id={id}
        aria-selected={active}
        padding={1}
        onClick={onClick}
        onKeyDown={(e) => onKeyDown(e.code)}
        ref={ref}
        className={cn(styles.tab, {
          [styles.tabSelected]: active,
          [styles.tabNotSelected]: !active,
        })}
        alignItems="center"
        justifyContent="center"
        background={active ? 'white' : 'blue100'}
      >
        <Text
          fontWeight={active ? 'medium' : 'light'}
          color={active ? 'blue400' : 'black'}
        >
          {name}
        </Text>
      </FocusableBox>
    )
  },
)
