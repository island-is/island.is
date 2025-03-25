import { useEffect, useRef, useState } from 'react'
import * as styles from './Image.css'

export interface ImageProps {
  url: string
  title?: string
  width: number
  height: number
}

export const Image = ({ url, title, width, height }: ImageProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Detect when image enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    if (imgRef.current) observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={styles.imageContainer}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <img
        ref={imgRef}
        src={isVisible ? `${url}?w=1000&fm=webp&q=75` : ''}
        srcSet={
          isVisible
            ? `
          ${url}?w=500&fm=webp&q=75 500w,
          ${url}?w=800&fm=webp&q=75 800w,
          ${url}?w=1000&fm=webp&q=75 1000w
        `
            : ''
        }
        sizes="(max-width: 500px) 500px,
               (max-width: 800px) 800px,
               1000px"
        alt={title || ''}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
        className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
      />
    </div>
  )
}

export default Image
