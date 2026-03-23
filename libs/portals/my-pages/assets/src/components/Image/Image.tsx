import { FC, useEffect, useState } from 'react'
import * as styles from './Image.css'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { useMountedState } from 'react-use'

export interface Props {
  url: string
  title: string
  height?: string
  width?: string
  isAnimation?: boolean
  isRemoteUrl?: boolean
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

export const Image: FC<Props> = ({
  url,
  title,
  height,
  width,
  isAnimation,
  isRemoteUrl,
}) => {
  const imageLoaded = useImageLoader(url)

  return (
    <Box className={styles.container} style={{ height, width }}>
      {!imageLoaded ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          height="full"
        >
          <LoadingDots size="large" />
        </Box>
      ) : (
        <img
          src={
            isAnimation || isRemoteUrl ? url : `data:image/png;base64,${url}`
          }
          alt={title}
          className={styles.image}
        />
      )}
    </Box>
  )
}

export default Image
