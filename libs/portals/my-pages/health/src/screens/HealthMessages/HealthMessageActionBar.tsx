import { Box, Button, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Tooltip, m } from '@island.is/portals/my-pages/core'
import * as styles from './HealthMessageActionBar.css'

type Props = {
  bookmarked?: boolean
  archived?: boolean
  onReply?: () => void
  onFav?: () => void
  onStash?: () => void
}

const HealthMessageActionBar = ({
  bookmarked,
  archived,
  onReply,
  onFav,
  onStash,
}: Props) => {
  const { formatMessage } = useLocale()

  const dropdownItems = [
    ...(onReply
      ? [
          {
            title: formatMessage(m.replyDocument),
            icon: 'undo' as const,
            iconType: 'outline' as const,
            onClick: onReply,
          },
        ]
      : []),
    {
      title: formatMessage(archived ? m.removeFromStorage : m.addToStorage),
      icon: 'fileTrayEmpty' as const,
      iconType: archived ? ('filled' as const) : ('outline' as const),
      onClick: onStash,
    },
    {
      title: formatMessage(bookmarked ? m.removeFavorite : m.addFavorite),
      icon: 'star' as const,
      iconType: bookmarked ? ('filled' as const) : ('outline' as const),
      onClick: onFav,
    },
  ]

  return (
    <>
      <Box className={styles.filterBtns} display="flex" alignItems="center" columnGap={1}>
        {onReply && (
          <Tooltip text={formatMessage(m.replyDocument)}>
            <Button
              circle
              icon="undo"
              iconType="outline"
              size="medium"
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
            size="medium"
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
            size="medium"
            colorScheme="light"
            aria-label={formatMessage(
              bookmarked ? m.removeFavorite : m.addFavorite,
            )}
            onClick={onFav}
          />
        </Tooltip>
      </Box>
      <DropdownMenu
        icon="ellipsisVertical"
        iconType="filled"
        items={dropdownItems}
        disclosure={
          <span className={styles.actionsButton}>
            <Tooltip text={formatMessage(m.actions)}>
              <Button
                icon="ellipsisVertical"
                iconType="filled"
                size="small"
                variant="text"
              />
            </Tooltip>
          </span>
        }
      />
    </>
  )
}

export default HealthMessageActionBar
