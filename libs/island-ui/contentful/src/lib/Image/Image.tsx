import * as styles from './Image.css'

export interface ImageProps {
  url: string
  description?: string | null
  width: number
  height: number
}

export const Image = ({ url, description, width, height }: ImageProps) => {
  if (!url) return null
  return (
    <img
      src={`${url}?w=1000&fm=webp&q=75`}
      srcSet={`
          ${url}?w=1000&fm=webp&q=75 1x,
          ${url}?w=1500&fm=webp&q=75 2x,
          ${url}?w=2000&fm=webp&q=75 3x
        `}
      alt={description || ''}
      height={height}
      width={width}
      loading="lazy"
      className={styles.image}
    />
  )
}

export default Image
