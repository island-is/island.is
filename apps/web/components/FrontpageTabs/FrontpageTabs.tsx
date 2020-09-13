/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import JSZip from 'jszip'
import Link from 'next/link'
import cn from 'classnames'
import bodymovin from 'lottie-web'
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
import { useRouteNames } from '@island.is/web/i18n/useRouteNames'
import { useI18n } from '../../i18n'
import { useApolloClient } from 'react-apollo'
import { GetContentfulAssetBlobQuery } from '@island.is/web/graphql/schema'
import { QueryGetContentfulAssetBlobArgs } from '@island.is/api/schema'
import { GET_CONTENTFUL_ASSET_BLOB_QUERY } from '@island.is/web/screens/queries'

import * as styles from './FrontpageTabs.treat'

const AUTOPLAY_TIMER = 8000

type ImageProps = {
  title: string
  url: string
  contentType: string
  width: number
  height: number
}

type FileProps = {
  url: string
  contentType: string
}

type TabsProps = {
  subtitle?: string
  title?: string
  content?: string
  image?: ImageProps
  animationZip?: FileProps
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
  const client = useApolloClient()
  const animationContainerRef = useRef(null)
  const zipsLoaded = useRef(null)
  const contentRef = useRef(null)
  const timer = useRef(null)
  const animationTimer = useRef(null)
  const [minHeight, setMinHeight] = useState<number>(0)
  const [animationData, setAnimationData] = useState([])
  const [maxContainerHeight, setMaxContainerHeight] = useState<number>(0)
  const [autoplayOn, setAutoplayOn] = useState<boolean>(autoplay)
  const [
    animationContainerTransitioning,
    setAnimationContainerTransitioning,
  ] = useState<boolean>(true)
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
    clearInterval(timer.current)

    if (autoplayOn) {
      timer.current = setInterval(() => nextSlide(), AUTOPLAY_TIMER)
    }

    return () => clearInterval(timer.current)
  }, [autoplayOn, nextSlide])

  useEffect(() => {
    setTimeout(onResize, 0)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  useEffect(() => {
    if (!zipsLoaded.current && tabs) {
      const urls = tabs.map((x) =>
        x.animationZip && x.animationZip.contentType === 'application/zip'
          ? x.animationZip.url
          : null,
      )

      const fetchZip = async (url) => {
        const {
          data: {
            getContentfulAssetBlob: { blob },
          },
        } = await client.query<
          GetContentfulAssetBlobQuery,
          QueryGetContentfulAssetBlobArgs
        >({
          query: GET_CONTENTFUL_ASSET_BLOB_QUERY,
          variables: {
            input: {
              url,
              type: 'application/zip',
            },
          },
        })

        return blob
      }

      const loadZips = async (urls) => {
        return Promise.all(
          urls.map(async (url) => {
            const zip = await fetchZip(url)
            const test = await loadZip(zip)

            return Promise.resolve(test)
          }),
        )
      }

      loadZips(urls).then((arr) => {
        setAnimationData(arr)
      })

      zipsLoaded.current = true
    }

    const newSelectedIndex = tab.items.findIndex((x) => x.id === tab.currentId)
    setSelectedIndex(newSelectedIndex)
    setAutoplayOn(false)
  }, [tab, zipsLoaded, client, tabs])

  useEffect(() => {
    if (animationContainerRef.current) {
      setAnimationContainerTransitioning(false)
      clearTimeout(animationTimer.current)

      animationTimer.current = setTimeout(() => {
        bodymovin.destroy()

        bodymovin.loadAnimation({
          container: animationContainerRef.current,
          loop: true,
          autoplay: true,
          animationData: animationData[selectedIndex],
        })

        setAnimationContainerTransitioning(false)
      }, 400)

      setAnimationContainerTransitioning(true)
    }
  }, [animationData, animationContainerRef, selectedIndex])

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
    <GridContainer className={styles.removeMobileSpacing}>
      <GridRow>
        <GridColumn span={[null, null, null, '1/12']}>
          <Box
            display="flex"
            height="full"
            width="full"
            justifyContent="center"
            alignItems="center"
          >
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
          <div ref={contentRef}>
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
            <Box paddingX={[3, 3, 0]}>
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
              <div className={styles.tabPanelWrapper}>
                {tabs.map(
                  ({ title, subtitle, content, link, animationZip }, index) => {
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
                              as="h2"
                              color="purple400"
                            >
                              <span className={styles.textItem}>
                                {subtitle}
                              </span>
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
                  },
                )}
              </div>
            </Box>
            <Box
              display="inlineFlex"
              alignItems="center"
              width="full"
              background="blue100"
              padding={3}
              borderRadius="large"
              className={styles.searchContentContainer}
            >
              {searchContent}
            </Box>
          </div>
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
              <div
                ref={animationContainerRef}
                className={cn(styles.animationContainer, {
                  [styles.animationContainerHidden]: animationContainerTransitioning,
                })}
              />
            </div>
          </Box>
        </GridColumn>
        <GridColumn span={[null, null, null, '1/12']}>
          <Box
            display="flex"
            height="full"
            width="full"
            justifyContent="center"
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

const convertDataURIToBinary = (dataURI) => {
  const BASE64_MARKER = ';base64,'
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
  const base64 = dataURI.substring(base64Index)
  const raw = window.atob(base64)
  const rawLength = raw.length
  const array = new Uint8Array(new ArrayBuffer(rawLength))

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i)
  }

  return array
}

const loadZip = async (dataURI) => {
  const data = convertDataURIToBinary(dataURI)

  return new Promise((resolve) => {
    JSZip.loadAsync(data).then(async (contents) => {
      const arr = contents.file(/\.json$/i)

      let jsonFileName = null

      if (arr.length) {
        jsonFileName = arr[0].name
      }

      if (!jsonFileName) {
        return null
      }

      const getImageBlob = async (image) =>
        new Promise((resolve) => {
          if (contents.file(image.path)) {
            return contents
              .file(image.path)
              .async('blob')
              .then((img) => {
                const reader = new FileReader()

                reader.onload = () => {
                  resolve(reader.result.toString())
                }

                reader.onerror = () => resolve(null)

                reader.readAsDataURL(img)
              })
          }

          resolve(null)
        })

      const getObj = async () =>
        new Promise((resolve) => {
          return contents
            .file(jsonFileName)
            .async('string')
            .then(async (str) => {
              const obj = JSON.parse(str)

              const images = obj.assets.map((x) => ({
                path: x.u + x.p,
                file: x.p,
              }))

              const updateImages = async () =>
                new Promise((resolve) => {
                  images.forEach(async (x, i) => {
                    if (contents.file(x.path)) {
                      const index = obj.assets.findIndex((y) => y.p === x.file)

                      const blob = await getImageBlob(x)

                      if (index > -1) {
                        obj.assets[index].u = ''
                        obj.assets[index].p = blob
                      }
                    }

                    if (i === images.length - 1) {
                      resolve()
                    }
                  })
                })

              await updateImages()

              resolve(obj)
            })
        })

      resolve(await getObj())
    })
  })
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
