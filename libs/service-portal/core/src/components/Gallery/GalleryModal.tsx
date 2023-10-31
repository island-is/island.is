import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './GalleryModal.css'
import cn from 'classnames'
import { useMountedState } from 'react-use'

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

export const GalleryModal: FC<Props> = ({
  id,
  onVisibilityChange,
  isVisible,
  disclosure,
  label,
  images,
}) => {
  const { formatMessage } = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [indexLimits, setIndexLimits] = useState({
    low: 0,
    high: MAX_GALLERY_IMAGES - 1,
  })

  useEffect(() => {
    if (currentIndex <= indexLimits['low']) {
      const delta = indexLimits.low - currentIndex
      setIndexLimits({
        low: indexLimits.low - delta,
        high: indexLimits.high - delta,
      })
    } else if (indexLimits['high'] <= currentIndex) {
      const delta = currentIndex - indexLimits.high
      setIndexLimits({
        low: indexLimits.low + delta,
        high: indexLimits.high + delta,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  const galleryImages = useMemo(() => {
    if (!images) {
      return null
    }
    return images.slice(indexLimits.low, indexLimits.high + 1)
  }, [indexLimits, images])

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
          <GridRow className={styles.mainImage}>
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
                  <button
                    className="domain-create-form__button__cancel"
                    type="button"
                    onClick={() => setCurrentIndex(indexLimits.low + index)}
                  >
                    {i}
                  </button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </ModalBase>
  )
}
