import React, { FC, useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import * as styles from './MultiImage.css'
import { useMountedState } from 'react-use'

export interface MultiImageProps {
  url: string
  title?: string
}

const useImageLoader = (url: string): boolean => {
  const isMounted = useMountedState()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image(100)
    img.onload = img.onerror = () => {
      if (isMounted()) {
        setLoaded(true)
      }
    }
    img.src = url
  }, [url])

  return loaded
}

export const MultiImage: FC<MultiImageProps> = ({ url, title }) => {
  const imageLoaded = useImageLoader(url)

  return (
    <div className={styles.container}>
      <img
        src={url}
        alt={title}
        className={cn(styles.image, { [styles.show]: imageLoaded })}
      />
    </div>
  )
}

export default Image
