import React, { FC, useState, useRef, useEffect } from 'react'
import FocusLock from 'react-focus-lock'
import { useKey, useClickAway } from 'react-use'
import cn from 'classnames'
import { Typography } from '../Typography/Typography'
import { LinkBox } from './components/LinkBox'
import * as styles from './SideMenu.treat'
import { Icon } from '../Icon/Icon'

interface TabLink {
  title: string
  url: string
}

interface ExternalLink {
  title: string
  url: string
  icon?: any
}

interface Tab {
  title: string
  links: TabLink[]
  externalLinksHeading?: string
  externalLinks?: ExternalLink[]
}

interface Props {
  tabs: Tab[]
  isVisible: boolean
  handleClose: () => void
}

export const SideMenu: FC<Props> = ({ tabs, isVisible, handleClose }) => {
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef(null)
  const buttonsRef = useRef([])

  useKey('Escape', handleClose)
  useClickAway(ref, handleClose)

  useEffect(() => {
    if (buttonsRef.current && buttonsRef.current[activeTab]) {
      buttonsRef.current[activeTab].focus()
    }
  }, [buttonsRef.current])

  return isVisible ? (
    <FocusLock>
      <div
        className={cn(styles.root, { [styles.isVisible]: isVisible })}
        ref={ref}
      >
        <div className={styles.tabHeader}>
          <button onClick={handleClose} tabIndex={-1}>
            <Icon type="close" />
          </button>
        </div>
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
              ref={(buttonEl) => (buttonsRef.current[index] = buttonEl)}
            >
              <Typography variant="eyebrow" color="blue400">
                {tab.title}
              </Typography>
            </button>
          ))}
        </div>
        {tabs.map((tab, index) => {
          const hasExternalLinks = tab.externalLinks && tab.externalLinks.length
          return (
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
              {hasExternalLinks && (
                <div className={styles.externalLinks}>
                  <Typography
                    variant="eyebrow"
                    color="blue400"
                    paddingTop={3}
                    paddingBottom={2}
                  >
                    {tab.externalLinksHeading || 'Aðrir opinberir vefir'}
                  </Typography>
                  <ul className={styles.externalLinksContent}>
                    {tab.externalLinks.map((externalLink) => (
                      <LinkBox
                        key={externalLink.url}
                        title={externalLink.title}
                        url={externalLink.url}
                        icon={externalLink.icon}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </FocusLock>
  ) : null
}
