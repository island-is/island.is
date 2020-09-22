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
  Hidden,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/web/i18n/I18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { useI18n } from '../../i18n'

import * as styles from './FrontpageTabs.treat'

type ImageProps = {
  title: string
  url: string
  contentType: string
  width: number
  height: number
}

type TabsProps = {
  subtitle?: string
  title?: string
  content?: string
  image?: ImageProps
  link?: string
  animationJson?: string
}

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
  const [maxContainerHeight, setMaxContainerHeight] = useState<number>(0)
  const itemsRef = useRef<Array<HTMLElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [image, setImage] = useState<ImageProps | null>(null)
  const tab = useTabState({
    baseId: 'frontpage-tab',
  })
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale as Locale)

  const updateImage = useCallback(() => {
    if (selectedIndex >= 0) {
      setImage(tabs[selectedIndex].image)
    }
  }, [selectedIndex, tabs])

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
    setMaxContainerHeight(0)

    let height = 0

    itemsRef.current.forEach((x) => {
      if (x) {
        height = Math.max(height, x.offsetHeight)
      }
    })

    setMinHeight(height)

    if (contentRef.current) {
      setMaxContainerHeight(contentRef.current.offsetHeight)
    }
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

      updateImage()
    }
  }, [selectedIndex, updateImage, animations])

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
            <Hidden below="lg">
              <button
                onClick={() => goTo('prev')}
                className={cn(styles.arrowButton, {
                  [styles.arrowButtonDisabled]: false,
                })}
              >
                <Icon color="red400" width="18" height="18" type="arrowLeft" />
              </button>
            </Hidden>
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box ref={contentRef}>
            <Hidden above="md">
              <Box
                display="flex"
                height="full"
                width="full"
                marginBottom={2}
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
                style={{ maxHeight: 220 }}
              >
                <Image image={image} />
              </Box>
            </Hidden>
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
                  let href = null
                  let as = null

                  const currentIndex = tab.items.findIndex(
                    (x) => x.id === tab.currentId,
                  )

                  const visible = currentIndex === index

                  if (link) {
                    const linkData = JSON.parse(link)
                    const contentId = linkData.sys?.contentType?.sys?.id

                    const slug = linkData.fields?.slug

                    if (
                      slug &&
                      ['article', 'category', 'news'].includes(contentId)
                    ) {
                      href = makePath(contentId, '/[slug]')
                      as = makePath(contentId, slug)
                    }
                  }

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
                          {href ? (
                            <Link as={as} href={href} passHref>
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
              paddingX={4}
              className={styles.searchContentContainer}
            >
              {searchContent}
            </Box>
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
          <Box
            display="flex"
            height="full"
            width="full"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            style={{ maxHeight: `${maxContainerHeight}px` }}
          >
            <div className={styles.imageContainer}>
              <Hidden below="lg">
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
              </Hidden>
            </div>
          </Box>
        </GridColumn>
        <GridColumn hiddenBelow="lg" span="1/12">
          <Box
            display="flex"
            height="full"
            width="full"
            justifyContent="flexEnd"
            alignItems="center"
          >
            <Hidden below="lg">
              <button
                onClick={() => goTo('next')}
                className={cn(styles.arrowButton, {
                  [styles.arrowButtonDisabled]: false,
                })}
              >
                <Icon color="red400" width="18" height="18" type="arrowRight" />
              </button>
            </Hidden>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

const Image = ({ image = null }: { image?: ImageProps }) => {
  if (!image) {
    return null
  }

  return (
    <Box
      display="flex"
      height="full"
      width="full"
      justifyContent="center"
      alignItems="center"
    >
      <img src={image.url} alt={image.title} />
    </Box>
  )
}

export default FrontpageTabs
