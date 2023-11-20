import { cloneElement } from 'react'
import * as styles from './GalleryItem.css'
import cn from 'classnames'
import { Box, FocusableBox } from '@island.is/island-ui/core'

export type GalleryItemProps = {
  children: React.ReactElement
  cover?: boolean // object fit, so images that arent product shots can be optionally full-width instead of contained
  active?: boolean
  thumbnail?: boolean
}

export const GalleryItem = ({
  children,
  cover,
  active,
  thumbnail,
}: GalleryItemProps) => {
  return (
    <FocusableBox
      className={cn(styles.galleryItem, {
        cover,
        thumbnail,
        [styles.galleryItemHero]: !thumbnail,
      })}
    >
      <Box className={styles.galleryItemInner}>
        {cloneElement(children, {
          className: cn(styles.itemImage, {
            [styles.activeImage]: active || thumbnail,
          }),
        })}
      </Box>
    </FocusableBox>
  )
}
