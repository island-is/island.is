import React, { FC, useState, ReactNode } from 'react'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import { Box } from '../Box/Box'
import { Select, SelectProps, Option } from '../Select/Select'

import * as styles from './Tabs.treat'
import { ValueType } from 'react-select'

const TAB_ID_PREFIX = 'tab'

type TabType = {
  label: string
  content: ReactNode
  disabled?: boolean
}

interface TabInterface {
  label: string
  selected?: number
  tabs: TabType[]
}

export const Tabs: FC<TabInterface> = ({ label, selected = 0, tabs }) => {
  const [selectedIndex, setSelectedIndex] = useState(selected)

  const tab = useTabState({
    selectedId: `${TAB_ID_PREFIX}-${selectedIndex}`,
  })

  const onChange = (value: ValueType<Option>) => {
    const e = value as Option
    setSelectedIndex(parseInt(e?.value?.toString() || '', 10))
    const id = `${TAB_ID_PREFIX}-${e?.value}`
    tab.move(id)
  }

  const selectOptions = tabs.map(({ label, disabled }, index) => {
    return {
      label,
      disabled: disabled,
      value: index,
    }
  })

  return (
    <Box position="relative">
      <div className={styles.bg} />
      <Box
        position="relative"
        padding={['gutter', 'gutter', 0]}
        paddingY="none"
      >
        <div className={styles.select}>
          <Select
            name={label}
            label={label}
            onChange={onChange}
            options={selectOptions}
            value={selectOptions[selectedIndex]}
            defaultValue={selectOptions[selectedIndex]}
          />
        </div>
        <TabList className={styles.tabList} {...tab} aria-label={label}>
          {tabs.map(({ label, disabled }, index) => (
            <Tab
              {...tab}
              key={index}
              disabled={disabled}
              onClick={() => setSelectedIndex(index)}
              id={`${TAB_ID_PREFIX}-${index}`}
              className={cn(styles.tab, {
                [styles.tabSelected]: index === selectedIndex,
                [styles.tabDisabled]: disabled,
              })}
            >
              {label}
            </Tab>
          ))}
        </TabList>
        {tabs.map(({ content }, index) => (
          <TabPanel {...tab} key={index} className={styles.tabPanel}>
            <Box
              padding={[0, 0, 'gutter']}
              paddingTop={[0, 0, 4]}
              paddingBottom={4}
            >
              {content}
            </Box>
          </TabPanel>
        ))}
      </Box>
    </Box>
  )
}

export default Tabs
