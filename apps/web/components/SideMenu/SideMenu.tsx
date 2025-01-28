import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import FocusLock from 'react-focus-lock'
import { RemoveScroll } from 'react-remove-scroll'
import { useKey, useWindowSize } from 'react-use'
import cn from 'classnames'

import {
  Box,
  Button,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  Link,
  Logo,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { MenuTabsContext } from '@island.is/web/context/MenuTabsContext/MenuTabsContext'
import { useI18n } from '@island.is/web/i18n'

import { LanguageToggler } from '../LanguageToggler'
import { SearchInput } from '../SearchInput/SearchInput'
import * as styles from './SideMenu.css'

interface TabLink {
  title: string
  href: string
}

interface Tab {
  title: string
  links: TabLink[]
  externalLinksHeading?: string
  externalLinks?: TabLink[]
}

interface Props {
  tabs?: Tab[]
  isVisible: boolean
  searchBarFocus?: boolean
  handleClose: () => void
}

export const SideMenu = ({
  tabs = [],
  isVisible,
  searchBarFocus = false,
  handleClose,
}: Props) => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef(null)
  const searchInputRef = useRef(null)
  const { activeLocale, t } = useI18n()
  const { width } = useWindowSize()
  const tabRefs = useRef<Array<HTMLElement | null>>([])
  const isMobile = width < theme.breakpoints.md
  const { menuTabs } = useContext(MenuTabsContext)

  const tabList = menuTabs || tabs

  useKey('Escape', handleClose)

  const handleClickOutside = useCallback(
    (e: { target: any }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      if (isVisible && ref.current && !ref.current.contains(e.target)) {
        handleClose()
      }
    },
    [ref, isVisible, handleClose],
  )

  const onKeyDown = useCallback((event: { key: string }, index: number) => {
    switch (event.key.toLowerCase()) {
      case 'arrowleft':
        if (index > 0) {
          setActiveTab(index - 1)
        }
        break
      case 'arrowright':
        if (index < tabList.length - 1) {
          setActiveTab(index + 1)
        }
        break
    }
  }, [])

  useEffect(() => {
    setActiveTab(0)

    if (searchBarFocus) {
      if (searchInputRef?.current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        searchInputRef.current.focus()
      }
    }
  }, [isVisible, searchBarFocus, searchInputRef])

  useEffect(() => {
    if (typeof window === 'object') {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    tabRefs.current[activeTab]?.focus()
  }, [activeTab])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isVisible, ref, handleClickOutside])

  const logoProps = {
    ...(mounted && { width: isMobile ? 30 : 40 }),
  }

  return (
    <RemoveScroll ref={ref} enabled={isMobile && isVisible}>
      <FocusLock noFocusGuards={true}>
        <Box
          component="nav"
          className={cn(styles.root, {
            [styles.isVisible]: isVisible,
          })}
          background="white"
          borderRadius="large"
          height="full"
          id="sideMenu"
          aria-labelledby="sideMenuToggle"
        >
          <Box
            display="flex"
            alignItems="center"
            paddingBottom={3}
            justifyContent="spaceBetween"
          >
            <Logo {...logoProps} iconOnly id="sideMenuLogo" />
          </Box>
          <Box className={styles.contentScrollWrapper}>
            <Hidden above="sm">
              <GridContainer>
                <GridRow>
                  <GridColumn span="12/12">
                    <SearchInput
                      ref={searchInputRef}
                      id="search_input_side_menu"
                      activeLocale={activeLocale}
                      placeholder={t.searchPlaceholder}
                      size="medium"
                    />
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn
                    span="8/12"
                    paddingTop={[2, 2, 3]}
                    paddingBottom={[2, 2, 3]}
                  >
                    <Link href="https://minarsidur.island.is/">
                      <Button icon="person" type="menu" fluid variant="utility">
                        {t.login}
                      </Button>
                    </Link>
                  </GridColumn>
                  <GridColumn
                    span="4/12"
                    paddingTop={[2, 2, 3]}
                    paddingBottom={[2, 2, 3]}
                  >
                    <LanguageToggler />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Hidden>

            <ul className={styles.tabBar} role="tablist">
              {tabList.map(
                (
                  tab: {
                    title:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                  index: number,
                ) => (
                  <li
                    key={index}
                    className={cn(styles.tabContainer, {
                      [styles.tabBorder]: activeTab === index,
                    })}
                    role="presentation"
                  >
                    <FocusableBox
                      ref={(el) => (tabRefs.current[index] = el) as any}
                      component="button"
                      className={styles.tabButton}
                      role="tab"
                      aria-controls={`tab-content-${index}`}
                      aria-selected={activeTab === index}
                      tabIndex={activeTab === index ? 0 : -1}
                      id={`tab-${index}`}
                      onClick={() => setActiveTab(index)}
                      onKeyDown={(e) => onKeyDown(e, index)}
                    >
                      <div className={styles.tab}>
                        <Text
                          variant="small"
                          fontWeight={activeTab === index ? 'medium' : 'light'}
                          color="blue400"
                        >
                          {tab.title}
                        </Text>
                      </div>
                    </FocusableBox>
                  </li>
                ),
              )}
            </ul>
            {tabList.map(
              (
                tab: {
                  externalLinks: any[]
                  links: any[]
                  externalLinksHeading:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined
                },
                index: number,
              ) => {
                const hasExternalLinks =
                  tab.externalLinks && tab.externalLinks.length
                return (
                  <div
                    id={`tab-content-${index}`}
                    key={index}
                    aria-labelledby={`tab-${index}`}
                    role="tabpanel"
                    className={styles.content}
                    hidden={activeTab !== index}
                  >
                    <div className={styles.linksContent}>
                      {tab.links.map(
                        (
                          link: {
                            href: any
                            as: any
                            title:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | ((props: {
                                  isFocused?: boolean | undefined
                                  isHovered?: boolean | undefined
                                }) => React.ReactNode)
                              | null
                              | undefined
                          },
                          index: number,
                        ) => {
                          const props = {
                            ...(link.href && { href: link.href }),
                            ...(link.as && { as: link.as }),
                          }

                          return (
                            <Text
                              key={index}
                              color="blue400"
                              fontWeight="medium"
                              paddingBottom={
                                index + 1 === tab.links.length ? 0 : 2
                              }
                            >
                              <Box
                                component="span"
                                display="inlineBlock"
                                width="full"
                                onClick={handleClose}
                              >
                                <FocusableBox {...props}>
                                  {link.title}
                                </FocusableBox>
                              </Box>
                            </Text>
                          )
                        },
                      )}
                    </div>
                    {hasExternalLinks && (
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Text
                          variant="small"
                          fontWeight="medium"
                          color="blue400"
                          paddingTop={3}
                          paddingBottom={3}
                        >
                          {tab.externalLinksHeading}
                        </Text>
                        <div className={styles.linksContent}>
                          {tab.externalLinks.map(
                            (
                              link: {
                                href: string | undefined
                                title:
                                  | string
                                  | number
                                  | boolean
                                  | React.ReactElement<
                                      any,
                                      string | React.JSXElementConstructor<any>
                                    >
                                  | Iterable<React.ReactNode>
                                  | React.ReactPortal
                                  | ((props: {
                                      isFocused?: boolean | undefined
                                      isHovered?: boolean | undefined
                                    }) => React.ReactNode)
                                  | null
                                  | undefined
                              },
                              index: number,
                            ) => (
                              <Text
                                key={index}
                                fontWeight="medium"
                                color="blue400"
                                paddingBottom={2}
                              >
                                <FocusableBox href={link.href}>
                                  {link.title}
                                </FocusableBox>
                              </Text>
                            ),
                          )}
                        </div>
                      </Box>
                    )}
                  </div>
                )
              },
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            className={styles.closeButton}
          >
            <FocusableBox component="button" onClick={handleClose} padding={1}>
              <Icon icon="close" color="blue400" />
            </FocusableBox>
          </Box>
        </Box>
      </FocusLock>
    </RemoveScroll>
  )
}
