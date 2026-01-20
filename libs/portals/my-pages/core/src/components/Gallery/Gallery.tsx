import { FC, useState, Children, cloneElement } from 'react'
import cn from 'classnames'
import * as styles from './Gallery.css'
import { Box, FocusableBox, LoadingDots, Text } from '@island.is/island-ui/core'
import { GalleryItemProps } from './GalleryItem'
import { isDefined } from '@island.is/shared/utils'
import { GalleryModal } from './GalleryModal'

export interface GalleryProps {
  loading?: boolean
  children?: React.ReactNode
  thumbnails?: React.ReactNode
}

export const Gallery: FC<GalleryProps> = ({
  loading = false,
  children,
  thumbnails,
}) => {
  const childArray = Children.toArray(children).slice(0, 3).filter(Boolean)
  const thumbnailsArray = Children.toArray(thumbnails).filter(Boolean)
  const shortenedThumbnailsArray = thumbnailsArray.slice(0, 4)

  const [activeItem, setActiveItem] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onThumbnailClick = (i: number, lastImage: boolean) => {
    if (lastImage) {
      setIsModalOpen(true)
    } else setActiveItem(i)
  }

  return (
    <>
      <Box className={styles.galleryContainer}>
        <FocusableBox
          className={styles.gallery}
          component="button"
          onClick={() => setIsModalOpen(true)}
          border="standard"
          borderRadius="large"
          overflow="hidden"
          transition="fast"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          height="full"
        >
          {loading ? (
            <Box>
              <LoadingDots size="large" />
            </Box>
          ) : (
            <Box className={styles.galleryImageWrap}>
              {childArray.map((item, i) =>
                cloneElement(item as React.ReactElement, {
                  active: i === activeItem,
                }),
              )}
            </Box>
          )}
        </FocusableBox>
        {!loading && thumbnailsArray.length && (
          <Box className={styles.thumbnailGrid}>
            {shortenedThumbnailsArray
              .map((thumbnail, i) => {
                if (!thumbnail) {
                  return null
                }
                const lastImage = shortenedThumbnailsArray.length - 1 === i

                return (
                  <FocusableBox
                    component="button"
                    key={i}
                    className={cn(styles.galleryButton, {
                      [styles.activeGalleryButton]: i === activeItem,
                    })}
                    onClick={() => onThumbnailClick(i, lastImage)}
                  >
                    <>
                      {cloneElement(
                        thumbnail as React.ReactElement<GalleryItemProps>,
                        {
                          thumbnail: true,
                        },
                      )}
                      {lastImage && (
                        <Box className={styles.lastImageOverlay}>
                          <Text
                            variant="h4"
                            as="p"
                            color="blue400"
                            fontWeight="semiBold"
                          >
                            +{thumbnailsArray.length - 4}
                          </Text>
                        </Box>
                      )}
                    </>
                    )
                  </FocusableBox>
                )
              })
              .filter(isDefined)}
          </Box>
        )}
      </Box>

      {isModalOpen && (
        <Box
          display="flex"
          alignItems="center"
          position="relative"
          height="full"
        >
          <GalleryModal
            id="ip-design-modal"
            isVisible={isModalOpen}
            onVisibilityChange={(isVisible) => setIsModalOpen(isVisible)}
            thumbnails={thumbnails}
            startingIndex={activeItem}
            label="all designs"
          >
            {children}
          </GalleryModal>
        </Box>
      )}
    </>
  )
}

export default Image
