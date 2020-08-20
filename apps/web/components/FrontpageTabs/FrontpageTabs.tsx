/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import Link from 'next/link'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import { Typography, Stack, Box, Button } from '@island.is/island-ui/core'
import { Locale } from '@island.is/web/i18n/I18n'
import { useRouteNames } from '@island.is/web/i18n/useRouteNames'
import { useI18n } from '../../i18n'
import Dots from './Dots'
import HeartSvg from './HeartSvg'

import * as styles from './FrontpageTabs.treat'

const AUTOPLAY_TIMER = 8000

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
}

export interface FrontpageTabsProps {
  tabs: TabsProps[]
  searchContent: ReactNode
  autoplay?: boolean
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
  autoplay = true,
}) => {
  const timer = useRef(null)
  const [minHeight, setMinHeight] = useState<number>(0)
  const [autoplayOn, setAutoplayOn] = useState<boolean>(autoplay)
  const itemsRef = useRef<Array<HTMLElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [image, setImage] = useState<ImageProps | null>(null)
  const tab = useTabState({
    baseId: 'frontpage-tab',
  })
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)

  const updateImage = useCallback(() => {
    if (selectedIndex >= 0) {
      setImage(tabs[selectedIndex].image)
    }
  }, [selectedIndex, tabs])

  const onResize = useCallback(() => {
    setMinHeight(0)

    let height = 0

    itemsRef.current.forEach((x) => {
      height = Math.max(height, x.offsetHeight)
    })

    setMinHeight(height)
  }, [itemsRef])

  const nextSlide = useCallback(() => {
    const index = tab.items.findIndex((x) => x.id === tab.currentId)
    const nextIndex = (index + 1) % tab.items.length

    tab.move(tab.items[nextIndex].id)
  }, [tab])

  useEffect(() => {
    clearInterval(timer.current)

    if (autoplayOn) {
      timer.current = setInterval(() => nextSlide(), AUTOPLAY_TIMER)
    }

    return () => clearInterval(timer.current)
  }, [autoplayOn, nextSlide])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  useEffect(() => {
    setSelectedIndex(tab.items.findIndex((x) => x.id === tab.currentId))
    setAutoplayOn(false)
  }, [tab])

  useEffect(() => {
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
  }, [selectedIndex, updateImage])

  return (
    <div className={styles.container}>
      <TabList {...tab} aria-label="My tabs" className={styles.tabWrapper}>
        {tabs.map(({ subtitle = '' }, index) => {
          return (
            <Tab key={index} {...tab} className={cn(styles.tabContainer)}>
              <TabBullet selected={selectedIndex === index} />
              <span className={styles.srOnly}>{subtitle}</span>
            </Tab>
          )
        })}
      </TabList>
      <div className={styles.content}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          marginRight={[0, 0, 0, 3]}
          width="full"
          position="relative"
        >
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

              if (slug && ['article', 'category'].includes(contentId)) {
                href = `${makePath(contentId)}/[slug]`
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
                    <Typography variant="eyebrow" as="h2" color="purple400">
                      <span className={styles.textItem}>{subtitle}</span>
                    </Typography>
                    <Typography variant="h1" as="h1">
                      <span className={styles.textItem}>{title}</span>
                    </Typography>
                    <Typography variant="p" as="p">
                      <span className={styles.textItem}>
                        {content}
                        {href ? (
                          <>
                            {` `}
                            <Link as={as} href={href} passHref>
                              <a className={styles.link}>
                                <Button variant="text" icon="arrowRight">
                                  Sjá nánar
                                </Button>
                              </a>
                            </Link>
                          </>
                        ) : null}
                      </span>
                    </Typography>
                  </Stack>
                </Box>
              </TabPanel>
            )
          })}

          <Box
            display="inlineFlex"
            alignItems="center"
            width="full"
            borderRadius="large"
            background="blue100"
            paddingX={[1, 1, 3]}
            paddingY={[1, 1, 4]}
          >
            {searchContent}
          </Box>
        </Box>

        <div className={styles.imageContainer}>
          <div className={styles.dots}>
            <Dots />
          </div>
          <div className={styles.image}>
            {image ? <img src={image.url} alt={image.title} /> : <HeartSvg />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrontpageTabs
