import React, {
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Text,
  Stack,
  Box,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Link,
} from '@island.is/island-ui/core'
import { Slice as SliceType, richText } from '@island.is/island-ui/contentful'
import { deorphanize } from '@island.is/island-ui/utils'
import { useI18n } from '../../i18n'
import { helperStyles, theme } from '@island.is/island-ui/theme'
import { GlobalContext } from '@island.is/web/context'
import { useNamespace } from '@island.is/web/hooks'
import LottieLoader from './LottiePlayer/LottieLoader'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import * as styles from './FrontpageSlider.css'
import { FrontpageSlider as FrontpageSliderType } from '@island.is/web/graphql/schema'
import fetch from 'isomorphic-fetch'

export interface FrontpageSliderProps {
  slides: FrontpageSliderType[]
  searchContent: ReactNode
}

export interface TabBulletProps {
  selected?: boolean
}

const TabBullet = ({ selected }: TabBulletProps) => {
  return (
    <span
      className={cn(styles.tabBullet, {
        [styles.tabBulletSelected]: selected,
      })}
    />
  )
}

export const FrontpageSlider = ({
  slides,
  searchContent,
}: FrontpageSliderProps) => {
  const { globalNamespace } = useContext(GlobalContext)
  const gn = useNamespace(globalNamespace)

  const contentRef = useRef(null)
  const [minHeight, setMinHeight] = useState<number>(0)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [animationData, setAnimationData] = useState([])
  const timerRef = useRef(null)

  const tab = useTabState({
    baseId: 'frontpage-tab',
  })

  const { t } = useI18n()

  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  useEffect(() => {
    const newSelectedIndex = tab.items.findIndex((x) => x.id === tab.currentId)
    setSelectedIndex(newSelectedIndex)
  }, [tab])

  const { linkResolver } = useLinkResolver()

  const goTo = (direction: string) => {
    switch (direction) {
      case 'prev':
        tab.previous()
        break
      case 'next':
        tab.next()
        break
      default:
        break
    }
  }

  const generateUrls = (link: string) => {
    if (link) {
      const linkData = JSON.parse(link)
      const contentId = linkData.sys?.contentType?.sys?.id
      const slug = String(linkData.fields?.slug)

      if (slug) {
        // the need for this check is caused by miss match in cache typename and cms typename
        // TODO: Make CMS get this content from cache to standardize type
        let type
        if (contentId === 'vidspyrna-frontpage') {
          type = 'adgerdirfrontpage'
        } else {
          type = contentId
        }
        return linkResolver(type, [slug])
      }
      return null
    }
  }

  useEffect(() => {
    if (!isMobile && !animationData.length) {
      const requests = slides.reduce((all, slide) => {
        if (slide.animationJsonAsset && slide.animationJsonAsset.url) {
          all.push(
            fetch(slide.animationJsonAsset.url).then((res) => res.json()),
          )
        }

        return all
      }, [])

      Promise.all(requests).then((res) => {
        setAnimationData(res)
      })
    }
  }, [isMobile, slides, animationData])

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
    timerRef.current = setTimeout(onResize, 5000)
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener('resize', onResize)
    }
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
        <GridColumn span={['12/12', '12/12', '7/12', '6/12']} position="static">
          <Box ref={contentRef}>
            <TabList
              {...tab}
              aria-label={t.carouselTitle}
              className={styles.tabWrapper}
            >
              {slides.map(({ title = '' }, index) => {
                return (
                  <Tab key={index} {...tab} className={styles.tabContainer}>
                    <TabBullet selected={selectedIndex === index} />
                    <span className={helperStyles.srOnly}>{title}</span>
                  </Tab>
                )
              })}
            </TabList>
            <Box className={styles.tabPanelWrapper}>
              {slides.map(
                ({ title, subtitle, content, intro, link }, index) => {
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
                      {visible && (
                        <Box
                          marginY={3}
                          ref={(el) => (itemRefs.current[index] = el)}
                          style={{ minHeight: `${minHeight}px` }}
                        >
                          <Stack space={3}>
                            <Text variant="eyebrow" color="purple400">
                              <span
                                className={cn(styles.textItem, {
                                  [styles.textItemVisible]: visible,
                                })}
                              >
                                {subtitle}
                              </span>
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

                            {intro ? (
                              <Box marginBottom={4}>
                                {richText(
                                  [
                                    {
                                      __typename: 'Html',
                                      id: intro.id,
                                      document: intro.document,
                                    },
                                  ] as SliceType[],
                                  undefined,
                                )}
                              </Box>
                            ) : (
                              <Text>
                                <span
                                  className={cn(styles.textItem, {
                                    [styles.textItemVisible]: visible,
                                  })}
                                >
                                  {content}
                                </span>
                              </Text>
                            )}
                            {linkUrls?.href && visible ? (
                              <span
                                className={cn(styles.textItem, {
                                  [styles.textItemVisible]: visible,
                                })}
                              >
                                <Link {...linkUrls} skipTab>
                                  <Button
                                    variant="text"
                                    icon="arrowForward"
                                    aria-labelledby={tabTitleId}
                                    as="span"
                                  >
                                    {gn('seeMore')}
                                  </Button>
                                </Link>
                              </span>
                            ) : null}
                          </Stack>
                        </Box>
                      )}
                    </TabPanel>
                  )
                },
              )}
            </Box>
          </Box>
          <GridColumn hiddenBelow="lg" position="static">
            <Box
              display="flex"
              height="full"
              alignItems="center"
              className={styles.tabListArrowLeft}
            >
              <Button
                circle
                colorScheme="light"
                icon="arrowBack"
                iconType="filled"
                aria-label={t.frontpageTabsPrevious}
                onClick={() => goTo('prev')}
                type="button"
                variant="primary"
              />
            </Box>
            <Box
              display="flex"
              height="full"
              justifyContent="flexEnd"
              alignItems="center"
              className={styles.tabListArrowRight}
            >
              <Button
                circle
                colorScheme="light"
                icon="arrowForward"
                iconType="filled"
                aria-label={t.frontpageTabsNext}
                onClick={() => goTo('next')}
                type="button"
                variant="primary"
              />
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
        <GridColumn hiddenBelow="md" span={['0', '0', '5/12', '4/12']}>
          <Box
            display="flex"
            flexDirection="column"
            height="full"
            justifyContent="center"
          >
            {!isMobile && animationData.length > 0 && (
              <LottieLoader
                animationData={animationData}
                selectedIndex={selectedIndex}
              />
            )}
          </Box>
        </GridColumn>
        <GridColumn hiddenBelow="lg" span="1/12" />
      </GridRow>
    </GridContainer>
  )
}

export default FrontpageSlider
