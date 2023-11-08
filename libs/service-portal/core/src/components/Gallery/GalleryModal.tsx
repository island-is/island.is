import {
  Children,
  FC,
  ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Box,
  FocusableBox,
  ModalBase,
  Swiper,
  Text,
  Button,
  Icon,
} from '@island.is/island-ui/core'
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
  const imageRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    imageRefs.current[activeItem]?.focus()
  }, [activeItem])

  useEffect(() => {
    imageRefs.current[activeItem]?.focus()
  }, [activeItem])

  const childArray = Children.toArray(children).filter(Boolean)
  const thumbnailsArray = Children.toArray(thumbnails).filter(Boolean)

  const onCaretClick = (direction: 'next' | 'prev') => {
    const nextItem = direction === 'next' ? activeItem + 1 : activeItem - 1
    if (nextItem < thumbnailsArray.length && nextItem >= 0) {
      setActiveItem(nextItem)
    } else {
      setActiveItem(direction === 'next' ? 0 : thumbnailsArray.length - 1)
    }
  }

  const onKeyDown = (event: { key: string }) => {
    switch (event.key.toLowerCase()) {
      case 'arrowleft':
        onCaretClick('prev')
        break
      case 'arrowright':
        onCaretClick('next')
        break
    }
  }

  if (!thumbnails) {
    return null
  }

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
          className={styles.closeButton}
          onClick={() => onVisibilityChange(false)}
        >
          <Button circle icon="close" variant="ghost" />
        </Box>
        <Box className={cn(styles.carets, styles.leftCaret)}>
          <Button
            icon="chevronBack"
            size="small"
            variant="ghost"
            onClick={() => onCaretClick('prev')}
          />
        </Box>
        <Box
          className={cn(galleryStyles.gallery, styles.main)}
          width="full"
          overflow="hidden"
          transition="fast"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box className={galleryStyles.galleryImageWrap}>
            {childArray.map((item, i) =>
              cloneElement(item as React.ReactElement, {
                active: i === activeItem,
              }),
            )}
          </Box>
        </Box>
        <Box className={cn(styles.carets, styles.rightCaret)}>
          <Button
            icon="chevronForward"
            size="small"
            variant="ghost"
            onClick={() => onCaretClick('next')}
          />
        </Box>
        <Box className={styles.counter} display="flex" justifyContent="center">
          <Text variant="small">
            {activeItem + 1} / {thumbnailsArray.length}
          </Text>
        </Box>
        <Box
          className={styles.swiper}
          overflow="hidden"
          paddingLeft={1}
          paddingRight={1}
        >
          <Swiper width={80}>
            {thumbnailsArray
              .map((thumbnail, i) => {
                if (!thumbnail) {
                  return null
                }

                return (
                  <FocusableBox
                    key={i}
                    ref={(el) => (imageRefs.current[i] = el)}
                    component="button"
                    color="blueberry"
                    aria-selected={activeItem === i}
                    onClick={() => setActiveItem(i)}
                    className={cn(galleryStyles.galleryButton, {
                      [galleryStyles.activeGalleryButton]: i === activeItem,
                    })}
                    onKeyDown={(e) => onKeyDown(e)}
                    style={{ height: '80px', width: '80px' }}
                  >
                    {cloneElement(
                      thumbnail as React.ReactElement<GalleryItemProps>,
                      {
                        thumbnail: true,
                      },
                    )}
                  </FocusableBox>
                )
              })
              .filter(isDefined)}
          </Swiper>
        </Box>
      </Box>
    </ModalBase>
  )
}
