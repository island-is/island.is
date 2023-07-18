import { FC, ReactElement, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Column,
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Inline,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './MultiImageModal.css'
import cn from 'classnames'

import Modal from '../Modal/Modal'
import classNames from 'classnames'

interface Props {
  id: string
  toggleClose?: boolean
  isVisible: boolean
  disclosure?: ReactElement
  label?: string
  images?: Array<ReactElement>
  onVisibilityChange: (isVisible: boolean) => void
  onThumbnailClick?: () => void
}

const MAX_GALLERY_IMAGES = 6

export const MultiImageModal: FC<Props> = ({
  id,
  onVisibilityChange,
  isVisible,
  disclosure,
  label,
  images,
}) => {
  const { formatMessage } = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)

  const galleryImages = useMemo(() => {
    if (!images) {
      return null
    }
    if (currentIndex >= MAX_GALLERY_IMAGES) {
      return images?.slice(
        currentIndex + 1 - MAX_GALLERY_IMAGES,
        currentIndex + 1,
      )
    }
    return images.slice(0, MAX_GALLERY_IMAGES)
  }, [currentIndex, images])

  if (!images || !galleryImages) {
    return null
  }

  const onChevronBackClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const onChevronForwardClick = () => {
    if (currentIndex < images?.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
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
        <GridContainer className={styles.content}>
          <GridRow className={styles.mainIMage}>
            <GridColumn className={styles.arrows} span={'2/12'}>
              <Button
                icon="chevronBack"
                size="small"
                variant="ghost"
                disabled={currentIndex <= 0}
                onClick={onChevronBackClick}
              />
            </GridColumn>
            <GridColumn span={'8/12'}>{images[currentIndex]}</GridColumn>
            <GridColumn className={styles.arrows} span={'2/12'}>
              <Button
                icon="chevronForward"
                size="small"
                variant="ghost"
                disabled={currentIndex >= images?.length - 1}
                onClick={onChevronForwardClick}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
        {galleryImages?.length && (
          <Box>
            <Box display="flex" justifyContent="center">
              <Text variant="small">
                {currentIndex + 1}/{images.length}
              </Text>
            </Box>
            <Box className={styles.thumbnailGallery}>
              {galleryImages.map((i, index) => (
                <Box
                  key={index}
                  className={cn(styles.thumbnail, {
                    [styles.selectedThumbnail]:
                      images.indexOf(i) === currentIndex,
                  })}
                >
                  {i}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </ModalBase>
  )
}

export default MultiImageModal
