import React, { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import FocusLock from 'react-focus-lock'
import { RemoveScroll } from 'react-remove-scroll'
import { useKey, useWindowSize } from 'react-use'
import cn from 'classnames'
import {
  Typography,
  Icon,
  Hidden,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useI18n } from '@island.is/web/i18n'
import * as styles from './SideMenu.treat'
import { SearchInput } from '../SearchInput/SearchInput'
import { LanguageToggler } from '../LanguageToggler'

interface TabLink {
  title: string
  url: string
}

interface Tab {
  title: string
  links: TabLink[]
  externalLinksHeading?: string
  externalLinks?: TabLink[]
}

interface Props {
  tabs: Tab[]
  isVisible: boolean
  handleClose: () => void
}

export const SideMenu: FC<Props> = ({ tabs, isVisible, handleClose }) => {
  const [activeTab, setActiveTab] = useState(0)
  const { activeLocale, t } = useI18n()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  useKey('Escape', handleClose)

  useEffect(() => {
    setActiveTab(0)
  }, [isVisible])

  return isVisible ? (
    <RemoveScroll enabled={isMobile}>
      <FocusLock>
        <Box
          className={cn(styles.root, { [styles.isVisible]: isVisible })}
          background="white"
          boxShadow="subtle"
          height="full"
        >
          <Box display="flex" paddingBottom={3} justifyContent="flexEnd">
            <button onClick={handleClose} tabIndex={-1}>
              <Icon type="close" />
            </button>
          </Box>
          <Hidden above="sm">
            <GridContainer className={styles.mobileContent}>
              <GridRow>
                <GridColumn span={12}>
                  <SearchInput
                    activeLocale={activeLocale}
                    placeholder="Leitaðu á Ísland.is"
                    size="medium"
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={8} paddingTop={3} paddingBottom={3}>
                  <Link href="https://minarsidur.island.is/" passHref>
                    <Button variant="menu" leftIcon="user" width="fluid">
                      {t.login}
                    </Button>
                  </Link>
                </GridColumn>
                <GridColumn span={4} paddingTop={3} paddingBottom={3}>
                  <LanguageToggler />
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Hidden>

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
          {tabs.map((tab, index) => {
            const hasExternalLinks =
              tab.externalLinks && tab.externalLinks.length
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
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Typography
                      variant="eyebrow"
                      color="blue400"
                      paddingTop={3}
                      paddingBottom={2}
                    >
                      {tab.externalLinksHeading || 'Aðrir opinberir vefir'}
                    </Typography>
                    <div className={styles.linksContent}>
                      {tab.externalLinks.map((link) => (
                        <Typography
                          key={link.url}
                          variant="sideMenu"
                          color="blue400"
                          paddingBottom={2}
                        >
                          <a href={link.url}>{link.title}</a>
                        </Typography>
                      ))}
                    </div>
                  </Box>
                )}
              </div>
            )
          })}
        </Box>
      </FocusLock>
    </RemoveScroll>
  ) : null
}
