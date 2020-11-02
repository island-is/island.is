/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import { useWindowSize, useEvent, useIsomorphicLayoutEffect } from 'react-use'
import {
  Text,
  Stack,
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  IconDeprecated as Icon,
  Button,
} from '@island.is/island-ui/core'
import { deorphanize } from '@island.is/island-ui/utils'
import { Locale } from '@island.is/web/i18n/I18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { useI18n } from '../../i18n'
import { theme } from '@island.is/island-ui/theme'
import Illustration from './illustrations/Illustration'
import * as styles from './FrontpageTabs.treat'

type TabsProps = {
  subtitle?: string
  title?: string
  content?: string
  link?: string
}

type LinkUrls = {
  href: string
  as: string
}

export const LEFT = 'Left'
export const RIGHT = 'Right'
export const UP = 'Up'
export const DOWN = 'Down'

export interface FrontpageTabsProps {
  tabs: TabsProps[]
  searchContent: ReactNode
}

export interface TabBulletProps {
  selected?: boolean
}

const TabBullet: FC<TabBulletProps> = ({ selected }) => {
  return (
    <div
      className={cn(styles.tabBullet, {
        [styles.tabBulletSelected]: selected,
      })}
    />
  )
}

export const FrontpageTabs: FC<FrontpageTabsProps> = ({
  tabs,
  searchContent,
}) => {
  const contentRef = useRef(null)
  const [minHeight, setMinHeight] = useState<number>(0)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const tab = useTabState({
    baseId: 'frontpage-tab',
  })

  const { activeLocale, t } = useI18n()
  const { makePath } = routeNames(activeLocale as Locale)
  const { width } = useWindowSize()

  const nextSlide = useCallback(() => {
    tab.next()
  }, [tab])

  const prevSlide = useCallback(() => {
    tab.previous()
  }, [tab])

  useEffect(() => {
    const newSelectedIndex = tab.items.findIndex((x) => x.id === tab.currentId)
    setSelectedIndex(newSelectedIndex)
  }, [tab])

  const goTo = (direction: string) => {
    switch (direction) {
      case 'prev':
        prevSlide()
        break
      case 'next':
        nextSlide()
        break
      default:
        break
    }
  }

  const generateUrls = (link: string): LinkUrls => {
    if (link) {
      const linkData = JSON.parse(link)
      const contentId = linkData.sys?.contentType?.sys?.id

      const slug = linkData.fields?.slug
      if (slug && ['article', 'category', 'news', 'page'].includes(contentId)) {
        return {
          href: contentId === 'page' ? slug : makePath(contentId, '[slug]'),
          as: makePath(contentId, slug),
        }
      }
      return { href: null, as: null }
    }
  }

  const onResize = useCallback(() => {
    setMinHeight(0)
    let height = 0

    itemRefs.current.forEach((item) => {
      if (item) {
        height =
          width < theme.breakpoints.md
            ? Math.min(height, item.offsetHeight)
            : Math.max(height, item.offsetHeight)
      }
    })

    setMinHeight(height)
  }, [width, itemRefs])

  useIsomorphicLayoutEffect(() => {
    setTimeout(onResize, 0)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  useIsomorphicLayoutEffect(() => {
    const el = itemRefs.current[selectedIndex]

    if (el) {
      const spans = el.getElementsByClassName(styles.textItem)

      Array.prototype.forEach.call(spans, (span, index) => {
        const ms = index * 100
        span.style.transitionDelay = `${ms}ms`
      })
    }
  }, [selectedIndex])

  return (
    <GridContainer>
      <GridRow className={styles.tabPanelRow}>
        <GridColumn hiddenBelow="lg" span="1/12" />
        <GridColumn
          span={['12/12', '12/12', '12/12', '6/12']}
          position="static"
        >
          <Box ref={contentRef}>
            <TabList
              {...tab}
              aria-label="Flettiborði"
              className={styles.tabWrapper}
            >
              {tabs.map(({ title = '' }, index) => {
                return (
                  <Tab key={index} {...tab} className={cn(styles.tabContainer)}>
                    <TabBullet selected={selectedIndex === index} />
                    <span className={styles.srOnly}>{title}</span>
                  </Tab>
                )
              })}
            </TabList>
            <Box className={styles.tabPanelWrapper}>
              {tabs.map(({ title, subtitle, content, link }, index) => {
                const linkUrls = generateUrls(link)

                // If none are found (during SSR) findIndex returns -1. We want 0 instead.
                const currentIndex = Math.max(
                  tab.items.findIndex((x) => x.id === tab.currentId),
                  0,
                )

                const visible = currentIndex === index
                const tabTitleId = 'frontpageTabTitle' + index
                return (
                  <TabPanel
                    key={index}
                    {...tab}
                    style={{
                      display: 'block',
                    }}
                    tabIndex={visible ? 0 : -1}
                    className={cn(styles.tabPanel, {
                      [styles.tabPanelVisible]: visible,
                    })}
                  >
                    <Box
                      paddingY={3}
                      ref={(el) => (itemRefs.current[index] = el)}
                      style={{ minHeight: `${minHeight}px` }}
                    >
                      <Stack space={3}>
                        <Text variant="eyebrow" color="purple400">
                          <span className={styles.textItem}>{subtitle}</span>
                        </Text>
                        <Text variant="h1" as="h1" id={tabTitleId}>
                          <span
                            className={cn(styles.textItem, {
                              [styles.textItemVisible]: visible,
                            })}
                          >
                            {deorphanize(title)}
                          </span>
                        </Text>
                        <Text>
                          <span
                            className={cn(styles.textItem, {
                              [styles.textItemVisible]: visible,
                            })}
                          >
                            {content}
                          </span>
                        </Text>
                        {linkUrls?.href && visible ? (
                          <span
                            className={cn(styles.textItem, {
                              [styles.textItemVisible]: visible,
                            })}
                          >
                            <Link
                              as={linkUrls.as}
                              href={linkUrls.href}
                              passHref
                            >
                              <Button
                                variant="text"
                                icon="arrowForward"
                                aria-labelledby={tabTitleId}
                              >
                                Sjá nánar
                              </Button>
                            </Link>
                          </span>
                        ) : null}
                      </Stack>
                    </Box>
                  </TabPanel>
                )
              })}
            </Box>
          </Box>
          <GridColumn hiddenBelow="lg" position="static">
            <Box
              display="flex"
              height="full"
              alignItems="center"
              className={styles.tabListArrowLeft}
            >
              <Box className={styles.zIndex1}>
                <Button
                  circle
                  aria-label={t.frontpageTabsPrevious}
                  colorScheme="light"
                  icon="arrowBack"
                  iconType="filled"
                  onClick={() => goTo('prev')}
                  size="default"
                  type="button"
                  variant="primary"
                ></Button>
              </Box>
            </Box>
            <Box
              display="flex"
              height="full"
              justifyContent="flexEnd"
              alignItems="center"
              className={styles.tabListArrowRight}
            >
              <Box className={styles.zIndex1}>
                <Button
                  circle
                  aria-label={t.frontpageTabsNext}
                  colorScheme="light"
                  icon="arrowForward"
                  iconType="filled"
                  onClick={() => goTo('next')}
                  size="default"
                  type="button"
                  variant="primary"
                ></Button>
              </Box>
            </Box>
          </GridColumn>

          <Box
            display="inlineFlex"
            alignItems="center"
            width="full"
            background="blue100"
            paddingTop={[4, 4, 5]}
            paddingBottom={4}
            paddingX={[3, 3, 4]}
            className={styles.searchContentContainer}
          >
            {searchContent}
          </Box>
        </GridColumn>
        <GridColumn hiddenBelow="lg" span={['0', '0', '0', '4/12']}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="full"
          >
            <Illustration illustrationIndex={selectedIndex} />
          </Box>
        </GridColumn>
        <GridColumn hiddenBelow="lg" span="1/12" />
      </GridRow>
    </GridContainer>
  )
}

export default FrontpageTabs
