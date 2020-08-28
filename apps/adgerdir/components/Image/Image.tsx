import React, { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import { Image as ApiImage } from '@island.is/api/schema'
import * as styles from './Image.treat'

export type CustomImage = {
  type: 'custom'
  src: string
  thumbnail: string
  alt: string
  originalWidth: number
  originalHeight: number
}

export type ApiImageSource = {
  type: 'apiImage'
  maxWidth?: number
  image: ApiImage
}

type AnyImageType = CustomImage | ApiImageSource

const normalizeImage = (img: AnyImageType): CustomImage => {
  switch (img.type) {
    case 'custom':
      return img
    case 'apiImage':
      return {
        type: 'custom',
        src: img.image.url + (img.maxWidth ? '?w=' + img.maxWidth : ''),
        thumbnail: img.image.url + '?w=50',
        alt: img.image.title ?? '',
        originalWidth: img.image.width,
        originalHeight: img.image.height,
      }
  }
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

const Image: FC<AnyImageType> = (image) => {
  const { src, thumbnail, alt, originalWidth, originalHeight } = normalizeImage(
    image,
  )
  const imageLoaded = useImageLoader(src)

  return (
    <div className={styles.container}>
      <div
        className={cn(styles.thumbnail, {
          [styles.thumbnailHide]: imageLoaded,
        })}
        style={{
          backgroundImage: `url(${thumbnail})`,
          paddingTop: imageLoaded
            ? 0
            : (originalHeight / originalWidth) * 100 + '%',
        }}
      />
      <img
        src={src}
        alt={alt}
        className={cn(styles.image, {
          [styles.imageShow]: imageLoaded,
        })}
      />
    </div>
  )
}

export default Image
