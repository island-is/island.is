import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import isNumber from 'lodash/isNumber'
import { useWindowSize } from 'react-use'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'

import { Colors, theme } from '@island.is/island-ui/theme'
import { Box } from '../Box/Box'
import { Select } from '../Select/Select'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { isDefined } from '@island.is/shared/utils'

import * as styles from './Tabs.css'

export type TabType = {
  /**
   * Required when prop onlyRenderSelectedTab is true
   */
  id?: string
  label: string
  content: ReactNode
  disabled?: boolean
}

interface TabInterface {
  label: string
  selected?: string
  tabs: TabType[]
  contentBackground?: Colors
  size?: 'xs' | 'sm' | 'md'
  onChange?(id: string): void
  onlyRenderSelectedTab?: boolean
}

export const Tabs: FC<React.PropsWithChildren<TabInterface>> = ({
  label,
  selected = '0',
  tabs,
  contentBackground = 'purple100',
  size = 'md',
  onChange: onChangeHandler,
  onlyRenderSelectedTab,
}) => {
  // When onlyRenderSelectedTab is true, then we need to make sure that every tab has an id prop defined
  if (onlyRenderSelectedTab && !tabs.every(({ id }) => isDefined(id))) {
    throw new Error(
      'Every tab must have a unique id when onlyRenderSelectedTab is enabled',
    )
  }

  const { loop, wrap, ...tab } = useTabState({
    selectedId: selected,
  })

  const [prevCurrentId, setPrevCurrentId] = useState(tab.currentId)

  const selectOptions = tabs.map(({ label, disabled, id }, index) => {
    return {
      label,
      disabled: disabled,
      value: id ?? index.toString(),
    }
  })

  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  useEffect(() => {
    if (onChangeHandler && tab.currentId && prevCurrentId !== tab.currentId) {
      onChangeHandler(tab.currentId)
      setPrevCurrentId(tab.currentId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.currentId])

  /**
    Tab value can be either an id or an index.
  */
  const getSelectedTabIndex = (): number => {
    const id = tab.selectedId

    if (!id) {
      return -1
    }

    //Assuming that the id is a string of some king
    const tabsIndex = tabs.findIndex((t) => t.id === id)
    if (tabsIndex >= 0) {
      //id found, returning index
      return tabsIndex
    }
    //Otherwise, return the index
    const index = Number.parseInt(id)

    if (Number.isNaN(index)) {
      //Somehting is wrong
      return -1
    }

    return index
  }

  const tabsUiSwitch = !isMobile && tabs.length < 7
  const tabListVisible = tabs.length > 1 && tabsUiSwitch

  return (
    <Box position="relative">
      <Box background={contentBackground} className={styles.bg} />
      <Box position="relative" paddingY="none">
        <Box hidden={tabsUiSwitch}>
          <Select
            size={size}
            name={label}
            label={label}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            onChange={(opt) => {
              tab.setCurrentId(opt?.value)
              tab.move(opt?.value ?? null)
            }}
            options={selectOptions}
            defaultValue={
              isNumber(selected)
                ? selectOptions[parseInt(selected)]
                : selectOptions.find((opt) => opt.value === selected)
            }
            isSearchable={false}
          />
        </Box>
        <TabList
          {...tab}
          wrap={wrap}
          aria-label={label}
          className={cn(styles.tabList, {
            [styles.tabListVisible]: tabListVisible,
          })}
        >
          {tabs.map(({ label, disabled, id }, index) => {
            const isTabSelected = id
              ? id === tab.selectedId
              : index.toString() === tab.selectedId

            const selectedTabIndex = getSelectedTabIndex()

            const isPreviousToSelectedTab = index + 1 === selectedTabIndex
            const isNextToSelectedTab = index - 1 === selectedTabIndex

            return (
              <FocusableBox
                {...tab}
                component={Tab}
                type="button"
                display="flex"
                key={index}
                disabled={disabled}
                id={id ?? `${index}`}
                justifyContent="center"
                aria-label={label}
                className={cn(styles.tab, {
                  [styles.tabSelected]: isTabSelected,
                  [styles.tabNotSelected]:
                    !isTabSelected &&
                    !isPreviousToSelectedTab &&
                    !isNextToSelectedTab,
                  [styles.tabPreviousToSelectedTab]: isPreviousToSelectedTab,
                  [styles.tabNextToSelectedTab]: isNextToSelectedTab,
                })}
              >
                <div className={styles.borderElement} />
                <div className={styles.circleElement} />
                <span className={styles.squareElement} />
                <span className={styles.tabText}>{label}</span>
              </FocusableBox>
            )
          })}
        </TabList>
        {tabs.map(({ content, id }, index) => (
          <TabPanel {...tab} key={index} className={styles.tabPanel}>
            {onlyRenderSelectedTab && id ? (
              tab.selectedId === id && <Box>{content}</Box>
            ) : (
              <Box>{content}</Box>
            )}
          </TabPanel>
        ))}
      </Box>
    </Box>
  )
}
