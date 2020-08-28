import React, { FC, useState, ReactNode } from 'react'
import cn from 'classnames'
import { Typography } from '../Typography/Typography'
import * as styles from './SideMenu.treat'

interface Props {
  tabs: any[]
}

export const SideMenu: FC<Props> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className={styles.root}>
      <div className={styles.tabBar}>
        {tabs.map((tab, index) => (
          <button
            role="tab"
            aria-controls={`tab-content-${index}`}
            className={cn(styles.tab, {
              [styles.tabActive]: activeTab === index,
            })}
            aria-selected={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            <Typography variant="eyebrow" color="blue400">
              {tab.title}
            </Typography>
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          aria-labelledby={`tab${index}`}
          role="tabpanel"
          className={styles.content}
          hidden={activeTab !== index}
        >
          <div className={styles.linksContent}>
            {tab.links.map((link, index) => (
              <Typography
                variant="sideMenu"
                color="blue400"
                paddingBottom={index + 1 === tab.links.length ? 0 : 2}
              >
                <a href={link.url}>{link.title}</a>
              </Typography>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
