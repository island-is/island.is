import React, { useEffect, useRef, useState } from 'react'
import { useIntersection } from 'react-use'
import cn from 'classnames'

import { Box, BoxProps } from '@island.is/island-ui/core'
import { Colors, theme } from '@island.is/island-ui/theme'

import * as styles from './BackgroundImage.css'

type BaseProps = {
  image?: { url?: string; title?: string }
  ratio?: string
  width?: number
  height?: number
  background?: Colors
  boxProps?: BoxProps
  positionX?: 'left' | 'right'
  backgroundSize?: 'cover' | 'contain'
  intersectionOptions?: IntersectionObserverInit
  quality?: number
  format?: 'jpg' | 'png' | 'webp' | 'gif' | 'avif'
}

type UseThumbnailProps = {
  useThumbnail?: boolean
  thumbnailColor?: never
}

type ThumbnailColorProps = {
  useThumbnail?: never
  thumbnailColor?: Colors
}

type ExtraProps = UseThumbnailProps | ThumbnailColorProps

const useImageLoader = (url: string, shouldLoad?: boolean): boolean => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (shouldLoad) {
      const img = new window.Image(100)
      img.onload = img.onerror = () => {
        setLoaded(true)
      }
      img.src = url
    }
  }, [url, shouldLoad])

  return loaded
}

export const BackgroundImage = ({
  image,
  ratio = '',
  width = 1000,
  height,
  background = 'transparent',
  backgroundSize = 'cover',
  positionX,
  thumbnailColor = 'dark100',
  quality = 80,
  useThumbnail,
  intersectionOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  },
  boxProps = {
    alignItems: 'center',
    width: 'full',
    display: 'inlineFlex',
    overflow: 'hidden',
  },
  format,
}: BaseProps & ExtraProps) => {
  const intersectionRef = useRef(null)
  const intersection = useIntersection(intersectionRef, intersectionOptions)
  const [shouldLoad, setShouldLoad] = useState<boolean>(false)
  const q = quality >= 0 && quality <= 100 ? quality : 80
  const src = `${image?.url}?w=${width}&q=${q}${format ? `&fm=${format}` : ''}`
  const backgroundImageRef = useRef<HTMLDivElement | null>(null)
  const thumbnail = image?.url + '?w=50&q=20'
  const alt = image?.title ?? ''
  const imageProps = alt
    ? {
        role: 'img',
        'aria-label': alt,
      }
    : {}

  useEffect(() => {
    if (!shouldLoad && intersection?.isIntersecting) {
      setShouldLoad(true)
    }
  }, [intersection])

  const imageLoaded = useImageLoader(src, shouldLoad)

  let paddingTop = '0px'

  if (ratio) {
    let r1 = 16
    let r2 = 9

    if (ratio.match(/[0-9]{1,2}:[0-9]{1,2}/g)) {
      const r = ratio.split(':')

      r1 = parseInt(r[0], 10)
      r2 = parseInt(r[1], 10)
    }

    paddingTop = `${(r2 / r1) * 100}%`
  } else {
    boxProps = {
      ...boxProps,
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
    }
  }

  let backgroundPosition = 'center center'

  switch (positionX) {
    case 'left':
      backgroundPosition = 'center left'
      break
    case 'right':
      backgroundPosition = 'center right'
      break
    default:
      break
  }

  return (
    <Box {...boxProps} ref={intersectionRef}>
      <div className={styles.container} style={{ paddingTop, background }}>
        <div
          className={cn(styles.thumbnail, styles.bgImage, {
            [styles.thumbnailHide]: imageLoaded,
          })}
          style={{
            ...(useThumbnail
              ? { backgroundImage: `url(${thumbnail})` }
              : { backgroundColor: theme.color[thumbnailColor] }),
            backgroundSize,
            backgroundPosition,
            height,
          }}
        />
        <div
          {...imageProps}
          ref={backgroundImageRef}
          className={cn(styles.image, styles.bgImage, {
            [styles.imageShow]: imageLoaded,
          })}
          style={{
            ...(shouldLoad && { backgroundImage: `url(${src})` }),
            backgroundSize,
            backgroundPosition,
            height,
          }}
        />
      </div>
    </Box>
  )
}

export default BackgroundImage
