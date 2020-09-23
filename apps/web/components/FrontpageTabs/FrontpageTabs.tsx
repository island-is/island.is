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
import Link from 'next/link'
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
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/web/i18n/I18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { useI18n } from '../../i18n'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

import * as styles from './FrontpageTabs.treat'

type TabsProps = {
  subtitle?: string
  title?: string
  content?: string
  link?: string
  animationJson?: string
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
  const { makePath } = routeNames(activeLocale as Locale)
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

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'arrowleft':
        goTo('prev')
        break
      case 'arrowright':
        goTo('prev')
        break
    }
  }

  const getDirection = (absX: number, absY: number, deltaX, deltaY) => {
    if (absX > absY) {
      if (deltaX > 0) {
        return LEFT
      }
      return RIGHT
    } else if (deltaY > 0) {
      return UP
    }
    return DOWN
  }

  const isMouseEvent = <T extends HTMLElement>(
    event: React.MouseEvent<T, MouseEvent> | React.TouchEvent<T>,
  ): event is React.MouseEvent<T, MouseEvent> => {
    return event.nativeEvent instanceof MouseEvent
  }

  const handleTouchStart = (
    e:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.TouchEvent<HTMLElement>,
  ) => {
    const x = isMouseEvent(e) ? e.clientX : e.targetTouches[0].pageX
    const y = isMouseEvent(e) ? e.clientY : e.targetTouches[0].pageY
    setInitialClientX(x)
  }

  const handleTouchMove = (
    e:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.TouchEvent<HTMLElement>,
  ) => {
    const x = isMouseEvent(e) ? e.clientX : e.targetTouches[0].pageX
    const y = isMouseEvent(e) ? e.clientY : e.targetTouches[0].pageY

    setFinalClientX(x)
    setFinalClientY(y)
  }

  const handleTouchEnd = (
    e:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.TouchEvent<HTMLElement>,
  ) => {
    if (e.cancelable) {
      e.preventDefault()
      e.stopPropagation()
    }

    const deltaX = finalClientX - initialClientX
    const deltaY = finalClientY - initialClientX
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (finalClientX > 10) {
      if (getDirection(absX, absY, deltaX, deltaY) === LEFT) {
        goTo('prev')
      }
      if (getDirection(absX, absY, deltaX, deltaY) === RIGHT) {
        goTo('next')
      }
    }

    setFinalClientX(0)
    setInitialClientX(0)
  }

  const generateUrls = (link: string): LinkUrls => {
    if (link) {
      const linkData = JSON.parse(link)
      const contentId = linkData.sys?.contentType?.sys?.id

      const slug = linkData.fields?.slug

      if (slug && ['article', 'category', 'news'].includes(contentId)) {
        return {
          href: makePath(contentId, '/[slug]'),
          as: makePath(contentId, slug),
        }
      }
      return { href: null, as: null }
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
                {tabs.map(({ title, subtitle, content, link }, index) => {
                  const linkUrls = generateUrls(link)

                  const currentIndex = tab.items.findIndex(
                    (x) => x.id === tab.currentId,
                  )

                  const visible = currentIndex === index
                  const isTabletOrMobile = width < theme.breakpoints.lg
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
                      onKeyDown={onKeyDown}
                    >
                      <Box
                        paddingY={3}
                        ref={(el) => (itemsRef.current[index] = el)}
                        style={{ minHeight: `${minHeight}px` }}
                        onTouchStart={(e) =>
                          isTabletOrMobile ? handleTouchStart(e) : null
                        }
                        onTouchEnd={(e) =>
                          isTabletOrMobile ? handleTouchEnd(e) : null
                        }
                        onTouchMove={(e) =>
                          isTabletOrMobile ? handleTouchMove(e) : null
                        }
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
                          {linkUrls.href ? (
                            <Link
                              as={linkUrls.as}
                              href={linkUrls.href}
                              passHref
                            >
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
