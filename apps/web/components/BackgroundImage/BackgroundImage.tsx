import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import cn from 'classnames'
import { BoxProps, Box } from '@island.is/island-ui/core'
import { theme, Colors } from '@island.is/island-ui/theme'
import { useMountedState } from 'react-use'
import * as styles from './BackgroundImage.treat'

export type BackgroundImageProps = {
  image: { url: string; title: string }
  ratio?: string
  width?: number
  height?: number
  background?: typeof theme.color[Colors]
  boxProps?: BoxProps
  positionX?: 'left' | 'right'
  backgroundSize?: 'cover' | 'contain'
  useThumbnail?: boolean
}

const useImageLoader = (url: string, shouldLoad?: boolean): boolean => {
  const isMounted = useMountedState()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (shouldLoad) {
      const img = new window.Image(100)
      img.onload = img.onerror = () => {
        if (isMounted) {
          setLoaded(true)
        }
      }
      img.src = url
    }
  }, [url, shouldLoad])

  return loaded
}

export const BackgroundImage = ({
  image = null,
  ratio = '',
  width = 1000,
  height,
  background = theme.color.dark100,
  backgroundSize = 'cover',
  positionX,
  useThumbnail,
  boxProps = {
    alignItems: 'center',
    width: 'full',
    display: 'inlineFlex',
    overflow: 'hidden',
    borderRadius: 'large',
  },
}: BackgroundImageProps) => {
  const [shouldLoad, setShouldLoad] = useState<boolean>(false)
  const src = `${image.url}?w=${width}`
  const backgroundImageRef = useRef<HTMLDivElement | null>(null)
  const thumbnail = image.url + '?w=50'
  const alt = image.title ?? ''
  const imageProps = alt
    ? {
        role: 'img',
        'aria-label': alt,
      }
    : {}

  useLayoutEffect(() => {
    if (backgroundImageRef?.current && 'IntersectionObserver' in window) {
      const lazyBackgroundObserver = new IntersectionObserver((entries) => {
        const entry = entries[0]

        if (entry.isIntersecting) {
          setShouldLoad(true)
          lazyBackgroundObserver.unobserve(entry.target)
        }
      })

      lazyBackgroundObserver.observe(backgroundImageRef.current)
    }
  }, [])

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
    <Box {...boxProps}>
      <div className={styles.container} style={{ paddingTop, background }}>
        <div
          className={cn(styles.thumbnail, styles.bgImage, {
            [styles.thumbnailHide]: imageLoaded,
          })}
          style={{
            ...(useThumbnail
              ? { backgroundImage: `url(${thumbnail})` }
              : { backgroundColor: theme.color.dark100 }),
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
            backgroundImage: `url(${src})`,
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
