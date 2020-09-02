import React, { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import { BoxProps, Box } from '@island.is/island-ui/core'
import { Image as ApiImage } from '@island.is/api/schema'
import * as styles from './BackgroundImage.treat'

export type BackgroundImageProps = {
  image: ApiImage
  ratio?: string
  boxProps?: BoxProps
}

const useImageLoader = (url: string): boolean => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image(100)
    img.onload = img.onerror = () => setLoaded(true)
    img.src = url
  }, [url])

  return loaded
}

const defaultBoxProps = {
  alignItems: 'center',
  width: 'full',
  height: 'full',
  display: 'inlineFlex',
  overflow: 'hidden',
  borderRadius: 'large',
} as BoxProps

export const BackgroundImage: FC<BackgroundImageProps> = ({
  image = null,
  ratio = '16:9',
  boxProps = defaultBoxProps,
}) => {
  const src = image.url + '?w=1000'
  const thumbnail = image.url + '?w=50'
  const alt = image.title ?? ''

  const imageLoaded = useImageLoader(src)

  let r1 = 16
  let r2 = 9

  if (ratio.match(/[0-9]{1,2}:[0-9]{1,2}/g)) {
    const r = ratio.split(':')

    r1 = parseInt(r[0], 10)
    r2 = parseInt(r[1], 10)
  }

  const paddingTop = `${(r2 / r1) * 100}%`

  return (
    <Box {...boxProps}>
      <div className={styles.container} style={{ paddingTop }}>
        <div
          className={cn(styles.thumbnail, styles.bgImage, {
            [styles.thumbnailHide]: imageLoaded,
          })}
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        />
        <div
          role="img"
          aria-label={alt}
          className={cn(styles.image, styles.bgImage, {
            [styles.imageShow]: imageLoaded,
          })}
          style={{
            backgroundImage: `url(${src})`,
          }}
        />
      </div>
    </Box>
  )
}

export default BackgroundImage
