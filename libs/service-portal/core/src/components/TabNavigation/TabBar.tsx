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
    const setFocusToTab = (id: number) => getMap().get(id)?.focus()

    let tabIndex: number | undefined
    if (keyCode === 'ArrowLeft') {
      tabIndex = idx > 0 ? idx - 1 : maxLength - 1
    } else if (keyCode === 'ArrowRight') {
      tabIndex = idx < maxLength - 1 ? idx + 1 : 0
    }

    if (typeof tabIndex === 'number') {
      setFocusToTab(tabIndex)
    }
  }

  if (!tabs || tabs.length < 1) {
    return null
  }

  const activeTab = tabs.find((tab) => tab.active)

  //must be an active tab
  if (!activeTab) {
    return null
  }

  const activeTabIndex = tabs.indexOf(activeTab)

  const tabItems = tabs.map((tab, index) => {
    return (
      <TabItem
        id={`tab-item-${index}`}
        active={tab.active}
        onClick={tab.onClick}
        variant={variant}
        isFirstTab={index === 0}
        isLastTab={index === tabs.length - 1}
        isNextTabToActive={index - 1 === activeTabIndex}
        isPrevTabToActive={index + 1 === activeTabIndex}
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

  if (!tabs?.length) {
    return null
  }

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
      role="tablist"
      background="blue100"
      width="full"
      {...boxProps}
    >
      {tabItems}
    </Box>
  )
}
