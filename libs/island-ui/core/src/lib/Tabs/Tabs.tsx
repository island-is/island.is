import React, { FC, ReactNode } from 'react'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import { Box } from '../Box/Box'
import { Select, Option } from '../Select/Select'

import * as styles from './Tabs.treat'
import { ValueType } from 'react-select'
import { Colors } from '@island.is/island-ui/theme'
import { FocusableBox } from '../FocusableBox/FocusableBox'

type TabType = {
  label: string
  content: ReactNode
  disabled?: boolean
}

interface TabInterface {
  label: string
  selected?: string
  tabs: TabType[]
  contentBackground?: Colors
}

export const Tabs: FC<TabInterface> = ({
  label,
  selected = '0',
  tabs,
  contentBackground = 'purple100',
}) => {
  const { loop, wrap, ...tab } = useTabState({
    selectedId: selected,
  })

  const selectOptions = tabs.map(({ label, disabled }, index) => {
    return {
      label,
      disabled: disabled,
      value: index.toString(),
    }
  })

  const onChange = (option: ValueType<Option>) => {
    const tabOption = option as Option
    tab.setCurrentId(tabOption?.value as string)
    tab.move(tabOption?.value as string)
  }

  return (
    <Box position="relative">
      <Box background={contentBackground} className={styles.bg} />
      <Box position="relative" paddingY="none">
        <div className={styles.select}>
          <Select
            name={label}
            label={label}
            onChange={onChange}
            options={selectOptions}
            defaultValue={selectOptions[parseInt(selected)]}
            isSearchable={false}
          />
        </div>
        <TabList
          className={styles.tabList}
          {...tab}
          wrap={wrap}
          aria-label={label}
        >
          {tabs.map(({ label, disabled }, index) => (
            <FocusableBox
              {...tab}
              component={Tab}
              key={index}
              disabled={disabled}
              id={`${index}`}
              justifyContent="center"
              aria-label={label}
              className={cn(styles.tab, {
                [styles.tabSelected]: index.toString() === tab.selectedId,
                [styles.tabDisabled]: disabled,
              })}
            >
              {label}
            </FocusableBox>
          ))}
        </TabList>
        {tabs.map(({ content }, index) => (
          <TabPanel {...tab} key={index} className={styles.tabPanel}>
            <Box>{content}</Box>
          </TabPanel>
        ))}
      </Box>
    </Box>
  )
}
