import { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import * as styles from './MultiImage.css'
import { useMountedState } from 'react-use'
import { Box, Inline, LoadingDots, Text } from '@island.is/island-ui/core'
import { ExcludesFalse } from '../..'
import MultiImageModal from './MultiImageModal'

export interface MultiImageProps {
  images: Array<{
    image?: string | null
    imageNumber?: number | null
  }>
  title: string
  loading?: boolean
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

export const MultiImage: FC<MultiImageProps> = ({
  images,
  title,
  loading = false,
}) => {
  const [firstImage, ...restOfImages] = images
  const lastImage = images[3]

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Inline space={2}>
        <Box
          className={styles.container}
          style={{ height: '352px', width: '352px' }}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              height="full"
            >
              <LoadingDots large />
            </Box>
          ) : (
            <img
              src={`data:image/png;base64,${images[selectedImageIndex].image}`}
              alt={title}
              className={cn(styles.image)}
            />
          )}
        </Box>
        {!loading && restOfImages.length && (
          <Box className={styles.thumbnailGrid}>
            {restOfImages
              .slice(0, 3)
              .map(({ image }, index) => {
                if (!image) {
                  return null
                }

                return (
                  <Box
                    key={index}
                    className={cn(styles.container, {
                      [styles.selectedImageOverlay]:
                        index === selectedImageIndex,
                    })}
                    style={{ height: '80px', width: '80px' }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={`data:image/png;base64,${image}`}
                        alt={title}
                        className={cn(styles.image)}
                      />
                    </button>
                  </Box>
                )
              })
              .filter(Boolean as unknown as ExcludesFalse)}
            {lastImage && lastImage.image && (
              <Box
                className={cn(styles.container)}
                style={{ height: '80px', width: '80px' }}
              >
                <img
                  src={`data:image/png;base64,${lastImage.image}`}
                  alt={title}
                  className={styles.image}
                />
                <button type="button" onClick={() => setIsModalOpen(true)}>
                  <Box className={styles.lastImageOverlay}>
                    <Text
                      variant="h4"
                      as="p"
                      color="blue400"
                      fontWeight="semiBold"
                    >
                      +{images.length - 4}
                    </Text>
                  </Box>
                </button>
              </Box>
            )}
          </Box>
        )}
      </Inline>
      {isModalOpen && lastImage.image && (
        <MultiImageModal
          id="ip-design-modal"
          isVisible={isModalOpen}
          onVisibilityChange={(isVisible) => setIsModalOpen(isVisible)}
          images={images
            .map((i, index) => (
              <img
                key={index}
                src={`data:image/png;base64,${i.image}`}
                alt={`some alt text`}
                className={styles.image}
              />
            ))
            .filter(Boolean as unknown as ExcludesFalse)}
          label="all designs"
        />
      )}
    </>
  )
}

export default Image
