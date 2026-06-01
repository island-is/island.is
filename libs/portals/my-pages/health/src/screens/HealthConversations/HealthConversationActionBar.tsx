import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Tooltip, m } from '@island.is/portals/my-pages/core'
import * as styles from './HealthConversationActionBar.css'

type Props = {
  bookmarked?: boolean
  archived?: boolean
  onReply?: () => void
  onFav?: () => void
  onStash?: () => void
}

const HealthConversationActionBar = ({
  bookmarked,
  archived,
  onReply,
  onFav,
  onStash,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      className={styles.filterBtns}
      display="flex"
      alignItems="center"
      style={{ gap: 4 }}
    >
      {onReply && (
        <Tooltip text={formatMessage(m.replyDocument)}>
          <Button
            circle
            icon="undo"
            iconType="outline"
            colorScheme="light"
            aria-label={formatMessage(m.replyDocument)}
            onClick={onReply}
          />
        </Tooltip>
      )}
      <Tooltip
        text={formatMessage(archived ? m.removeFromStorage : m.addToStorage)}
      >
        <Button
          circle
          icon="fileTrayEmpty"
          iconType={archived ? 'filled' : 'outline'}
          colorScheme="light"
          aria-label={formatMessage(
            archived ? m.removeFromStorage : m.addToStorage,
          )}
          onClick={onStash}
        />
      </Tooltip>
      <Tooltip
        text={formatMessage(bookmarked ? m.removeFavorite : m.addFavorite)}
      >
        <Button
          circle
          icon="star"
          iconType={bookmarked ? 'filled' : 'outline'}
          colorScheme="light"
          aria-label={formatMessage(
            bookmarked ? m.removeFavorite : m.addFavorite,
          )}
          onClick={onFav}
        />
      </Tooltip>
    </Box>
  )
}

export default HealthConversationActionBar
