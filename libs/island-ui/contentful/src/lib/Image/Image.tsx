import React, { FC, useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import * as styles from './Image.css'
import { useMountedState } from 'react-use'

export interface ImageProps {
  url: string
  title?: string
  thumbnail: string
  // NB: width and height is used for calculating ratio of the image - the
  // element rendered will take up all available horizontal space
  width: number
  height: number
}

const useImageLoader = (url: string): boolean => {
  const isMounted = useMountedState()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image(100)
    img.onload = img.onerror = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      if (isMounted) {
        setLoaded(true)
      }
    }
    img.src = url
  }, [url])

  return loaded
}

export const Image: FC<React.PropsWithChildren<ImageProps>> = ({
  url,
  title,
  thumbnail = url + '?w=50',
  width,
  height,
}) => {
  const imageLoaded = useImageLoader(url)

  return (
    <div
      className={styles.container}
      style={{ paddingTop: (height / width) * 100 + '%' }}
    >
      <img
        src={thumbnail}
        alt=""
        className={cn(styles.image, styles.thumbnail, {
          [styles.hide]: imageLoaded,
        })}
      />
      <img
        src={url}
        alt={title}
        className={cn(styles.image, { [styles.show]: imageLoaded })}
      />
    </div>
  )
}

export default Image
