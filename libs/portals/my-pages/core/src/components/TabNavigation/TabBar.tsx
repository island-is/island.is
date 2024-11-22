import { Box, BoxProps } from '@island.is/island-ui/core'
import * as styles from './TabBar.css'
import { useRef } from 'react'
import { TabItem, TabItemProps } from './TabItem'
import { useLocale } from '@island.is/localization'
import { SubTabItem } from './SubTabItem'

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

  if (!tabs?.length) {
    return null
  }

  if (variant === 'alternative') {
    return (
      <Box
        role="tablist"
        borderRadius="xs"
        borderColor="blue100"
        borderWidth="large"
        display="flex"
        className={styles.tabBar}
        {...boxProps}
      >
        {tabs.map((tab, index) => (
          <SubTabItem
            id={`tab-item-${index}`}
            key={`tab-item-${index}`}
            active={tab.active}
            onClick={tab.onClick}
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
        ))}
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
      {tabs.map((tab, index) => (
        <TabItem
          id={`tab-item-${index}`}
          key={`tab-item-${index}`}
          active={tab.active}
          onClick={tab.onClick}
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
      ))}
    </Box>
  )
}
