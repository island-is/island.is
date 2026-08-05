import { Box, Button, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, Tooltip } from '@island.is/portals/my-pages/core'
import cn from 'classnames'
import React from 'react'
import * as styles from './MessageActions.css'

type MessageActionsProps = {
  onFav?: (event: React.MouseEvent<HTMLElement>) => void
  onStash?: (event: React.MouseEvent<HTMLElement>) => void
  onRead?: (event: React.MouseEvent<HTMLElement>) => void
  onReply?: (event: React.MouseEvent<HTMLElement>) => void
  bookmarked?: boolean
  archived?: boolean
  loading?: boolean
  stashLabels?: { add: string; remove: string }
  colorScheme?: 'light' | 'negative'
  size?: 'small' | 'default' | 'large'
}

const blurAfter =
  (handler?: React.MouseEventHandler<HTMLElement>) =>
  (e: React.MouseEvent<HTMLElement>) => {
    handler?.(e)
    e.currentTarget.blur()
  }

export const MessageActions: React.FC<MessageActionsProps> = ({
  onFav,
  onStash,
  onRead,
  onReply,
  bookmarked,
  archived,
  loading,
  stashLabels,
  colorScheme = 'light',
  size = 'small',
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
          text={
            archived
              ? stashLabels?.remove ?? formatMessage(m.removeFromStorage)
              : stashLabels?.add ?? formatMessage(m.addToStorage)
          }
        >
          <Button
            circle
            icon="fileTrayEmpty"
            iconType={archived ? 'filled' : 'outline'}
            aria-label={
              archived
                ? stashLabels?.remove ?? formatMessage(m.removeFromStorage)
                : stashLabels?.add ?? formatMessage(m.addToStorage)
            }
            onClick={blurAfter(onStash)}
            size={size}
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
            aria-label={formatMessage(
              bookmarked ? m.removeFavorite : m.addFavorite,
            )}
            onClick={blurAfter(onFav)}
            size={size}
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
            aria-label={formatMessage(m.markAsRead)}
            onClick={blurAfter(onRead)}
            size={size}
            colorScheme={colorScheme}
          />
        </Tooltip>
      )}
      {onReply && (
        <Tooltip text={formatMessage(m.replyDocument)}>
          <Button
            circle
            icon="undo"
            iconType="outline"
            aria-label={formatMessage(m.replyDocument)}
            onClick={blurAfter(onReply)}
            size={size}
            colorScheme={colorScheme}
          />
        </Tooltip>
      )}
    </Box>
  )
}

export default MessageActions
