import React, { MouseEvent } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import * as styles from './FavAndStash.css'

type FavAndStashProps = {
  onFav?: (event: MouseEvent<HTMLElement>) => void
  onStash?: (event: MouseEvent<HTMLElement>) => void
  bookmarked?: boolean
  archived?: boolean
}

export const FavAndStash: React.FC<FavAndStashProps> = ({
  onFav,
  onStash,
  bookmarked,
  archived,
}) => {
  return (
    <Box className={styles.filterActionButtons} display="flex">
      {onStash && (
        <Button
          circle
          icon="archive"
          iconType={archived ? 'filled' : 'outline'}
          onClick={onStash}
          size="small"
          title="Store items"
          colorScheme="light"
        />
      )}
      {onFav && (
        <Button
          circle
          icon="star"
          iconType={bookmarked ? 'filled' : 'outline'}
          onClick={onFav}
          size="small"
          title="Favorite items"
          colorScheme="light"
        />
      )}
    </Box>
  )
}
