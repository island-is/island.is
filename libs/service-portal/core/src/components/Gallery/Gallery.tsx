import { FC, useState, Children, cloneElement } from 'react'
import cn from 'classnames'
import * as styles from './Gallery.css'
import {
  AlertMessage,
  Box,
  Inline,
  LoadingDots,
  Swiper,
  Text,
} from '@island.is/island-ui/core'
import { GalleryItemProps } from '../..'
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

  return (
    <>
      <Inline space={2}>
        <Box
          className={styles.gallery}
          border="standard"
          borderRadius="large"
          overflow="hidden"
          transition="fast"
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
            <Box className={styles.galleryImageWrap}>
              {childArray.map((item, i) =>
                cloneElement(item as React.ReactElement, {
                  active: i === activeItem,
                }),
              )}
            </Box>
          )}
        </Box>
        {!loading && thumbnailsArray.length && (
          <Box className={styles.thumbnailGrid}>
            {shortenedThumbnailsArray
              .map((thumbnail, i) => {
                if (!thumbnail) {
                  return null
                }
                const lastImage = shortenedThumbnailsArray.length - 1 === i

                return (
                  <Box
                    key={i}
                    className={cn(styles.galleryButton, {
                      [styles.activeGalleryButton]: i === activeItem,
                    })}
                    style={{ height: '80px', width: '80px' }}
                  >
                    {lastImage ? (
                      <>
                        {cloneElement(
                          thumbnail as React.ReactElement<GalleryItemProps>,
                          {
                            thumbnail: true,
                          },
                        )}
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                        >
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
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setActiveItem(i)}>
                        {cloneElement(
                          thumbnail as React.ReactElement<GalleryItemProps>,
                          {
                            thumbnail: true,
                          },
                        )}
                      </button>
                    )}
                  </Box>
                )
              })
              .filter(isDefined)}
          </Box>
        )}
      </Inline>

      {isModalOpen && (
        <GalleryModal
          id="ip-design-modal"
          isVisible={isModalOpen}
          onVisibilityChange={(isVisible) => setIsModalOpen(isVisible)}
          thumbnails={thumbnails}
          label="all designs"
        >
          {children}
        </GalleryModal>
      )}
    </>
  )
}

export default Image
