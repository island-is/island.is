import { Children, FC, ReactElement, cloneElement, useState } from 'react'
import { Box, ModalBase, Swiper } from '@island.is/island-ui/core'
import * as styles from './GalleryModal.css'
import * as galleryStyles from './Gallery.css'
import cn from 'classnames'
import { GalleryItemProps } from './GalleryItem'
import { isDefined } from '@island.is/shared/utils'

interface Props {
  id: string
  toggleClose?: boolean
  isVisible: boolean
  disclosure?: ReactElement
  label?: string
  children?: React.ReactNode
  thumbnails?: React.ReactNode
  onVisibilityChange: (isVisible: boolean) => void
  onThumbnailClick?: () => void
}

const MAX_GALLERY_IMAGES = 6

export const GalleryModal: FC<Props> = ({
  id,
  onVisibilityChange,
  isVisible,
  disclosure,
  label,
  children,
  thumbnails,
}) => {
  const [activeItem, setActiveItem] = useState(0)

  if (!thumbnails) {
    return null
  }

  const childArray = Children.toArray(children).filter(Boolean)
  const thumbnailsArray = Children.toArray(thumbnails).filter(Boolean)

  return (
    <ModalBase
      baseId={id}
      onVisibilityChange={onVisibilityChange}
      isVisible={isVisible}
      disclosure={disclosure}
      modalLabel={label}
      className={styles.modal}
    >
      <Box className={styles.container}>
        <Box
          className={galleryStyles.gallery}
          width="full"
          overflow="hidden"
          transition="fast"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            className={galleryStyles.galleryImageWrap}
            style={{ height: '400px', width: '300px' }}
          >
            {childArray.map((item, i) =>
              cloneElement(item as React.ReactElement, {
                active: i === activeItem,
              }),
            )}
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          {activeItem + 1}/{thumbnailsArray.length}
        </Box>
        <Box overflow="hidden" paddingLeft={1} paddingRight={1}>
          <Swiper>
            {thumbnailsArray
              .map((thumbnail, i) => {
                if (!thumbnail) {
                  return null
                }

                return (
                  <Box
                    key={i}
                    className={cn(galleryStyles.galleryButton, {
                      [galleryStyles.activeGalleryButton]: i === activeItem,
                    })}
                    style={{ height: '80px', width: '80px' }}
                  >
                    <button type="button" onClick={() => setActiveItem(i)}>
                      {cloneElement(
                        thumbnail as React.ReactElement<GalleryItemProps>,
                        {
                          thumbnail: true,
                        },
                      )}
                    </button>
                  </Box>
                )
              })
              .filter(isDefined)}
          </Swiper>
        </Box>
      </Box>
    </ModalBase>
  )
}
