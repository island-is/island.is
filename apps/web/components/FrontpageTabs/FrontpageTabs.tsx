import React, { FC } from 'react'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
// import { Typography } from '@island.is/island-ui/core'

import * as styles from './FrontpageTabs.treat'

export interface FrontpageTabsProps {
  selected?: boolean
}

const TabBullet: FC<FrontpageTabsProps> = ({ selected }) => {
  return (
    <div
      className={cn(styles.tabBullet, {
        [styles.tabBulletSelected]: selected,
      })}
    />
  )
}

const tabs = [
  {
    title: 'Tab title 1',
    content: 'Tab content 1',
  },
  {
    title: 'Tab title 2',
    content: 'Tab content 2',
  },
  {
    title: 'Tab title 3',
    content: 'Tab content 3',
  },
]

export const FrontpageTabs: FC<FrontpageTabsProps> = () => {
  const tab = useTabState()

  return (
    <>
      <TabList {...tab} aria-label="My tabs" className={styles.tabWrapper}>
        {tabs.map((_, index) => {
          const id = `frontpage-tab-${index}`
          const selected = tab.selectedId === id

          return (
            <Tab key={index} {...tab} id={id} className={styles.tabContainer}>
              <TabBullet selected={selected} />
            </Tab>
          )
        })}
      </TabList>
      {tabs.map((item, index) => (
        <TabPanel key={index} {...tab}>
          {item.content}
        </TabPanel>
      ))}
    </>
  )
}

export default FrontpageTabs
