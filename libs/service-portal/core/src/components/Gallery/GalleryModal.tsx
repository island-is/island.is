import {
  Children,
  FC,
  ReactElement,
  cloneElement,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Swiper,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './GalleryModal.css'
import * as galleryStyles from './Gallery.css'
import cn from 'classnames'
import { useMountedState } from 'react-use'
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
          overflow="hidden"
          transition="fast"
          style={{ height: '352px', width: '352px' }}
        >
          <Box className={galleryStyles.galleryImageWrap}>
            {childArray.map((item, i) =>
              cloneElement(item as React.ReactElement, {
                active: i === activeItem,
              }),
            )}
          </Box>
        </Box>
        <Box>
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
