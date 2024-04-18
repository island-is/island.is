import { Box, BoxProps } from '@island.is/island-ui/core'
import * as styles from './TabBar.css'
import { useRef } from 'react'
import { TabItem, TabItemProps } from './TabItem'
import { useLocale } from '@island.is/localization'

interface Props extends BoxProps {
  tabs?: Array<Omit<TabItemProps, 'onKeyDown' | 'ref'>>
  variant?: 'default' | 'alternative'
}

export const TabBar = ({ tabs, variant = 'default', ...boxProps }: Props) => {
  const { formatMessage } = useLocale()
  const tabRef = useRef<null | Map<number, HTMLElement>>(null)

  const getMap = () => {
    if (!tabRef?.current) {
      tabRef.current = new Map<number, HTMLElement>()
    }
    return tabRef.current
  }

  const keyPressHandler = (idx: number, maxLength: number, keyCode: string) => {
    const setFocusToTab = (id: number) => {
      const map = getMap()
      const node = map.get(id)

      if (node) {
        node.focus()
      }
    }

    if (keyCode === 'ArrowLeft') {
      if (idx > 0) {
        setFocusToTab(idx - 1)
      } else {
        setFocusToTab(maxLength - 1)
      }
    }
    if (keyCode === 'ArrowRight') {
      if (idx < maxLength - 1) {
        setFocusToTab(idx + 1)
      } else {
        setFocusToTab(0)
      }
    }
  }

  const tabItems = tabs?.map((tab, index) => {
    return (
      <TabItem
        id={`tab-item-${index}`}
        active={tab.active}
        onClick={tab.onClick}
        variant={variant}
        onKeyDown={(code) => keyPressHandler(index, tabs.length, code)}
        name={formatMessage(tab.name)}
        ref={(node) => {
          const map = getMap()
          if (node) {
            map.set(index, node)
          } else {
            map.delete(index)
          }
        }}
      />
    )
  })

  if (variant === 'alternative') {
    return (
      <Box
        background={'blue100'}
        marginY={1}
        borderRadius="standard"
        borderColor="blue100"
        borderWidth="large"
        className={styles.tabBar}
        {...boxProps}
      >
        {tabItems}
      </Box>
    )
  }

  return (
    <Box
      className={styles.tabBar}
      background="blue100"
      width="full"
      {...boxProps}
    >
      {tabItems}
    </Box>
  )
}
