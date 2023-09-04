import React, { FC, ReactNode, useEffect, useState } from 'react'
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

type TabType = {
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
    if (width < theme.breakpoints.md) {
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

  return (
    <Box position="relative">
      <Box background={contentBackground} className={styles.bg} />
      <Box position="relative" paddingY="none">
        {isMobile && (
          <div className={styles.select}>
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
          </div>
        )}
        <TabList
          className={styles.tabList}
          {...tab}
          wrap={wrap}
          aria-label={label}
        >
          {tabs.map(({ label, disabled, id }, index) => (
            <FocusableBox
              {...tab}
              component={Tab}
              type="button"
              key={index}
              disabled={disabled}
              id={id ?? `${index}`}
              justifyContent="center"
              aria-label={label}
              className={cn(styles.tab, {
                [styles.tabSelected]: id
                  ? id === tab.selectedId
                  : index.toString() === tab.selectedId,
                [styles.tabDisabled]: disabled,
              })}
            >
              {label}
            </FocusableBox>
          ))}
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
