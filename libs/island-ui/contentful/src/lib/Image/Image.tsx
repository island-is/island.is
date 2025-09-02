import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './Image.css'

export interface ImageProps {
  url: string
  description?: string | null
  caption?: string
  width: number
  height: number
}

export const Image = ({
  url,
  description,
  caption,
  width,
  height,
}: ImageProps) => {
  if (!url) return null
  return (
    <Box
      display="flex"
      height="full"
      justifyContent="center"
      alignItems="center"
      flexDirection={'column'}
    >
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
      {caption && (
        <Text variant="medium" fontWeight="light" marginTop={1}>
          {caption}
        </Text>
      )}
    </Box>
  )
}

export default Image
