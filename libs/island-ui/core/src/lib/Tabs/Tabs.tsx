import React, { FC, ReactNode, useEffect, useState } from 'react'
import isNumber from 'lodash/isNumber'
import { useMeasure } from 'react-use'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'

import { Colors, theme } from '@island.is/island-ui/theme'
import { Box } from '../Box/Box'
import { Select } from '../Select/Select'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Text } from '../Text/Text'
import { isDefined } from '@island.is/shared/utils'

import * as styles from './Tabs.css'

export type TabType = {
  /**
   * Required when prop onlyRenderSelectedTab is true
   */
  id?: string
  label: string
  content: ReactNode | Array<TabType>
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
  variant?: 'default' | 'alternative'
}

export const Tabs: FC<React.PropsWithChildren<TabInterface>> = ({
  label,
  selected = '0',
  tabs,
  contentBackground = 'purple100',
  size = 'md',
  onChange: onChangeHandler,
  onlyRenderSelectedTab,
  variant = 'default',
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

  const [containerRef, { width: containerWidth }] = useMeasure<HTMLDivElement>()

  const breakpoint =
    tabs.length < 3 ? theme.breakpoints.md : theme.breakpoints.lg
  const isContainerWideEnough =
    containerWidth >= breakpoint || containerWidth === 0
  const showDesktopLayout =
    tabs.length >= 2 && tabs.length < 7 && isContainerWideEnough

  useEffect(() => {
    if (onChangeHandler && tab.currentId && prevCurrentId !== tab.currentId) {
      onChangeHandler(tab.currentId)
      setPrevCurrentId(tab.currentId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.currentId])

  if (tabs.length === 1) {
    const singleTabContent = tabs[0].content
    return (
      <Box position="relative" ref={containerRef} width="full">
        <Box background={contentBackground} className={styles.bg} />
        <Box position="relative" paddingY="none">
          <TabPanel {...tab} className={styles.tabPanel}>
            <Box>
              {Array.isArray(singleTabContent) ? null : singleTabContent}
            </Box>
          </TabPanel>
        </Box>
      </Box>
    )
  }

  /**
    Tab value can be either an id or an index.
  */
  const getSelectedTabIndex = (): number => {
    const id = tab.selectedId

    if (!id) {
      return -1
    }

    //Assuming that the id is a string of some kind
    const tabsIndex = tabs.findIndex((t) => t.id === id)
    if (tabsIndex >= 0) {
      //id found, returning index
      return tabsIndex
    }
    //Otherwise, return the index
    const index = Number.parseInt(id)

    if (Number.isNaN(index)) {
      //Sometting is wrong
      return -1
    }

    return index
  }

  return (
    <Box position="relative" ref={containerRef} width="full">
      <Box background={contentBackground} className={styles.bg} />
      <Box position="relative" paddingY="none" width="full">
        <Box hidden={tabs.length < 2 || showDesktopLayout} width="full">
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
          className={styles.tabList({
            type: variant,
            visible: showDesktopLayout,
          })}
        >
          {tabs.map(({ label, disabled, id }, index) => {
            const isTabSelected = id
              ? id === tab.selectedId
              : index.toString() === tab.selectedId

            const selectedTabIndex = getSelectedTabIndex()

            const isPreviousToSelectedTab = index + 1 === selectedTabIndex
            const isNextToSelectedTab = index - 1 === selectedTabIndex

            if (variant === 'alternative') {
              return (
                <FocusableBox
                  {...tab}
                  component={Tab}
                  type="button"
                  display="flex"
                  key={`alternative-${index}`}
                  disabled={disabled}
                  id={id ?? `${index}`}
                  justifyContent="center"
                  alignItems="center"
                  aria-label={label}
                  className={styles.tabAlternative({
                    state: isTabSelected ? 'selected' : 'notSelected',
                    showDivider: !isTabSelected && !isPreviousToSelectedTab,
                  })}
                >
                  <Text
                    fontWeight={isTabSelected ? 'semiBold' : 'light'}
                    variant="small"
                    color={isTabSelected ? 'blue400' : 'black'}
                  >
                    {label}
                  </Text>
                </FocusableBox>
              )
            }

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
                className={styles.tabDefault({
                  state: isTabSelected
                    ? 'selected'
                    : isPreviousToSelectedTab
                    ? 'previousToSelected'
                    : isNextToSelectedTab
                    ? 'nextToSelected'
                    : 'notSelected',
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
        {tabs.map(({ content, id }, index) => {
          let panelContent
          if (Array.isArray(content)) {
            panelContent = (
              <Box
                marginTop={showDesktopLayout ? 3 : 2}
                marginBottom={showDesktopLayout ? 2 : 1}
              >
                <Tabs
                  label=""
                  variant="alternative"
                  contentBackground="white"
                  tabs={content}
                  size={size ?? 'xs'}
                />
              </Box>
            )
          } else {
            panelContent = <Box>{content}</Box>
          }
          return (
            <TabPanel {...tab} key={index} className={styles.tabPanel}>
              {onlyRenderSelectedTab && id
                ? tab.selectedId === id && <Box>{panelContent}</Box>
                : panelContent}
            </TabPanel>
          )
        })}
      </Box>
    </Box>
  )
}
