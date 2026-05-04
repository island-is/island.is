import { Box, Button, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import React, { MouseEvent } from 'react'
import { Tooltip } from '../ToolTip/ToolTip'
import { m } from '../../lib/messages'
import * as styles from './FavAndStash.css'

type FavAndStashProps = {
  onFav?: (event: MouseEvent<HTMLElement>) => void
  onStash?: (event: MouseEvent<HTMLElement>) => void
  onRead?: (event: MouseEvent<HTMLElement>) => void
  bookmarked?: boolean
  archived?: boolean
  loading?: boolean
  stashLabels?: { add: string; remove: string }
  /** Use 'light' on blue-tinted backgrounds (default), 'negative' on white backgrounds */
  colorScheme?: 'light' | 'negative'
}

export const FavAndStash: React.FC<FavAndStashProps> = ({
  onFav,
  onStash,
  onRead,
  bookmarked,
  archived,
  loading,
  stashLabels,
  colorScheme = 'light',
}) => {
  const { formatMessage } = useLocale()

  if (loading) {
    return (
      <Box display="flex" alignItems="center">
        <LoadingDots />
      </Box>
    )
  }

  return (
    <Box
      className={cn(styles.filterActionButtons, {
        [styles.hoverWhite]: colorScheme === 'light',
      })}
      display="flex"
      height="full"
      alignItems="center"
    >
      {onStash && (
        <Tooltip
          text={archived ? (stashLabels?.remove ?? formatMessage(m.removeFromStorage)) : (stashLabels?.add ?? formatMessage(m.addToStorage))}
        >
          <Button
            circle
            icon="fileTrayEmpty"
            iconType={archived ? 'filled' : 'outline'}
            onClick={onStash}
            size="small"
            colorScheme={colorScheme}
          />
        </Tooltip>
      )}
      {onFav && (
        <Tooltip
          text={formatMessage(bookmarked ? m.removeFavorite : m.addFavorite)}
        >
          <Button
            circle
            icon="star"
            iconType={bookmarked ? 'filled' : 'outline'}
            onClick={onFav}
            size="small"
            colorScheme={colorScheme}
          />
        </Tooltip>
      )}
      {onRead && (
        <Tooltip text={formatMessage(m.markAsRead)}>
          <Button
            circle
            icon="mailOpen"
            iconType="outline"
            onClick={onRead}
            size="small"
            colorScheme={colorScheme}
          />
        </Tooltip>
      )}
    </Box>
  )
}

export default FavAndStash
