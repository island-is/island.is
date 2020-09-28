/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import bodymovin from 'lottie-web'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import {
  Typography,
  Stack,
  Box,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Icon,
  Link,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/web/types'
import { Link as LinkType } from '@island.is/web/graphql/schema'
import routeNames from '@island.is/web/routes'
import { useI18n } from '../../i18n'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

import * as styles from './FrontpageTabs.treat'

type TabsProps = {
  subtitle?: string
  title?: string
  content?: string
  animationJson?: string
  slideLink?: LinkType
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
  const [animationData, setAnimationData] = useState([])
  const animationContainerRefs = useRef<Array<HTMLElement | null>>([])
  const [animations, setAnimations] = useState([])
  const animationDataLoaded = useRef(null)
  const [minHeight, setMinHeight] = useState<number>(0)
  const itemsRef = useRef<Array<HTMLElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [initialClientX, setInitialClientX] = useState<number>(0)
  const [finalClientX, setFinalClientX] = useState<number>(0)
  const [finalClientY, setFinalClientY] = useState<number>(0)

  const tab = useTabState({
    baseId: 'frontpage-tab',
  })
  const { activeLocale } = useI18n()
  const { getLinkProps } = routeNames(activeLocale as Locale)
  const { width } = useWindowSize()

  useEffect(() => {
    if (!animationDataLoaded.current) {
      const data = tabs.map((x) =>
        x.animationJson ? JSON.parse(x.animationJson) : null,
      )
      setAnimationData(data)
      animationDataLoaded.current = true
    }
  }, [tabs, animationDataLoaded])

  useEffect(() => {
    if (animationContainerRefs.current?.length) {
      const newAnimations = []

      animationContainerRefs.current.forEach((x, i) => {
        newAnimations.push(
          bodymovin.loadAnimation({
            container: x,
            loop: true,
            autoplay: false,
            animationData: animationData[i],
          }),
        )
      })

      setAnimations(newAnimations)
    }
  }, [animationData, animationContainerRefs])

  const onResize = useCallback(() => {
    setMinHeight(0)

    let height = 0

    itemsRef.current.forEach((x) => {
      if (x) {
        height =
          width < theme.breakpoints.md
            ? Math.min(height, x.offsetHeight)
            : Math.max(height, x.offsetHeight)
      }
    })

    setMinHeight(height)
  }, [itemsRef, contentRef])

  const nextSlide = useCallback(() => {
    tab.next()
  }, [tab])

  const prevSlide = useCallback(() => {
    tab.previous()
  }, [tab])

  useEffect(() => {
    setTimeout(onResize, 0)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  useEffect(() => {
    const newSelectedIndex = tab.items.findIndex((x) => x.id === tab.currentId)
    setSelectedIndex(newSelectedIndex)
  }, [tab])

  useEffect(() => {
    if (animations.length) {
      animations.forEach((x, i) => {
        if (typeof animations[i] === 'object') {
          if (i === selectedIndex) {
            animations[i].play()
          } else {
            animations[i].stop()
          }
        }
      })
    }

    itemsRef.current.forEach((x) => {
      const spans = x.querySelectorAll('span')

      Array.prototype.forEach.call(spans, (span) => {
        span.classList.remove(styles.textItemVisible)
      })
    })

    const el = itemsRef.current[selectedIndex]

    if (el) {
      const spans = el.querySelectorAll('span')

      Array.prototype.forEach.call(spans, (span, index) => {
        span.classList.add(styles.textItemVisible)
        const ms = index * 100
        span.style.transitionDelay = `${ms}ms`
      })
    }
  }, [selectedIndex, animations])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, false)

    return () => {
      document.removeEventListener('keydown', onKeyDown, false)
    }
  }, [])

  const onKeyDown = useCallback((event) => {
    switch (event.key.toLowerCase()) {
      case 'arrowleft':
        goTo('prev')
        break
      case 'arrowright':
        goTo('prev')
        break
    }
  }, [])

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

  return (
    <GridContainer>
      <GridRow>
        <GridColumn hiddenBelow="lg" span="1/12">
          <Box display="flex" height="full" width="full" alignItems="center">
            <button
              onClick={() => goTo('prev')}
              className={cn(styles.arrowButton, {
                [styles.arrowButtonDisabled]: false,
              })}
            >
              <Icon color="red400" width="18" height="18" type="arrowLeft" />
            </button>
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box ref={contentRef}>
            <Box>
              <TabList
                {...tab}
                aria-label="My tabs"
                className={styles.tabWrapper}
              >
                {tabs.map(({ subtitle = '' }, index) => {
                  return (
                    <Tab
                      key={index}
                      {...tab}
                      className={cn(styles.tabContainer)}
                    >
                      <TabBullet selected={selectedIndex === index} />
                      <span className={styles.srOnly}>{subtitle}</span>
                    </Tab>
                  )
                })}
              </TabList>
              <Box className={styles.tabPanelWrapper}>
                {tabs.map(({ title, subtitle, content, slideLink }, index) => {
                  const currentIndex = tab.items.findIndex(
                    (x) => x.id === tab.currentId,
                  )

                  const visible = currentIndex === index

                  const linkReference = slideLink?.linkReference
                  const href = linkReference?.url || slideLink.url

                  const linkProps = linkReference
                    ? getLinkProps(linkReference)
                    : null

                  const props = {
                    href,
                    ...(linkProps && { ...linkProps, prefetch: true }),
                  }

                  console.log('props', props)
                  return (
                    <TabPanel
                      key={index}
                      {...tab}
                      style={{
                        display: 'inline-block',
                      }}
                      tabIndex={visible ? 0 : -1}
                      className={cn(styles.tabPanel, {
                        [styles.tabPanelVisible]: visible,
                      })}
                    >
                      <Box
                        paddingY={3}
                        ref={(el) => (itemsRef.current[index] = el)}
                        style={{ minHeight: `${minHeight}px` }}
                      >
                        <Stack space={3}>
                          <Typography
                            variant="eyebrow"
                            as="p"
                            color="purple400"
                          >
                            <span className={styles.textItem}>{subtitle}</span>
                          </Typography>
                          <Typography variant="h1" as="h1">
                            <span className={styles.textItem}>{title}</span>
                          </Typography>
                          <Typography variant="p" as="p">
                            <span className={styles.textItem}>{content}</span>
                          </Typography>
                          {props.href ? (
                            <Link {...props} pureChildren passHref>
                              <Button
                                variant="text"
                                icon="arrowRight"
                                tabIndex={visible ? 0 : -1}
                              >
                                Sjá nánar
                              </Button>
                            </Link>
                          ) : null}
                        </Stack>
                      </Box>
                    </TabPanel>
                  )
                })}
              </Box>
            </Box>
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
          </Box>
        </GridColumn>
        <GridColumn hiddenBelow="lg" span={['0', '0', '0', '4/12']}>
          {animationData.map((_, index) => {
            const visible = index === selectedIndex

            return (
              <div
                key={index}
                ref={(el) => (animationContainerRefs.current[index] = el)}
                className={cn(styles.animationContainer, {
                  [styles.animationContainerHidden]: !visible,
                })}
              />
            )
          })}
        </GridColumn>
        <GridColumn hiddenBelow="lg" span="1/12">
          <Box
            display="flex"
            height="full"
            width="full"
            justifyContent="flexEnd"
            alignItems="center"
          >
            <button
              onClick={() => goTo('next')}
              className={cn(styles.arrowButton, {
                [styles.arrowButtonDisabled]: false,
              })}
            >
              <Icon color="red400" width="18" height="18" type="arrowRight" />
            </button>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default FrontpageTabs
