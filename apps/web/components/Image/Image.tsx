import React, { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import { Image as ApiImage } from '@island.is/api/schema'
import * as styles from './Image.treat'

const useImageLoader = (url: string): boolean => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image(100)
    img.onload = img.onerror = () => setLoaded(true)
    img.src = url
  }, [url])

  return loaded
}

export interface ImageProps {
  src: string
  thumbnail: string
  alt: string
  ratio: number
}

const Image: FC<ImageProps> = ({ src, thumbnail, alt = '', ratio }) => {
  const imageLoaded = useImageLoader(src)

  return (
    <div className={styles.container}>
      <div
        className={cn(styles.thumbnail, {
          [styles.thumbnailHide]: imageLoaded,
        })}
        style={{
          backgroundImage: `url(${thumbnail})`,
          paddingTop: imageLoaded ? 0 : (1 / ratio) * 100 + '%',
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

export const apiImageToProps = (
  img: ApiImage,
  { width, alt }: { width?: number; alt?: string } | undefined = {},
): ImageProps => ({
  src: img.url + (width ? '?w=' + width : ''),
  thumbnail: img.url + '?w=50',
  alt: alt ?? img.title ?? '',
  ratio: img.width / img.height,
})

export default Image
