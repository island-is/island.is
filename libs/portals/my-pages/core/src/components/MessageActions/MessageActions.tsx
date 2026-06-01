import { Box, Button, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import React, { MouseEvent } from 'react'
import { Tooltip } from '../ToolTip/ToolTip'
import { m } from '../../lib/messages'
import * as styles from './MessageActions.css'

type MessageActionsProps = {
  onFav?: (event: MouseEvent<HTMLElement>) => void
  onStash?: (event: MouseEvent<HTMLElement>) => void
  onRead?: (event: MouseEvent<HTMLElement>) => void
  onReply?: (event: MouseEvent<HTMLElement>) => void
  bookmarked?: boolean
  archived?: boolean
  loading?: boolean
  stashLabels?: { add: string; remove: string }
  colorScheme?: 'light' | 'negative'
}

const blurAfter =
  (handler?: (e: MouseEvent<HTMLElement>) => void) =>
  (e: MouseEvent<HTMLElement>) => {
    handler?.(e)
    ;(e.currentTarget as HTMLElement).blur()
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
            onClick={blurAfter(onStash)}
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
            onClick={blurAfter(onFav)}
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
            onClick={blurAfter(onRead)}
            size="small"
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
            onClick={blurAfter(onReply)}
            size="small"
            colorScheme={colorScheme}
          />
        </Tooltip>
      )}
    </Box>
  )
}

export default MessageActions
