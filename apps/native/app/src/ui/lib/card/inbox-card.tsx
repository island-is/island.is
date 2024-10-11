import React, { useEffect, useState } from 'react'
import { ImageSourcePropType } from 'react-native'
import { useTheme } from 'styled-components/native'
import { PressableHighlight } from '../../../components/pressable-highlight/pressable-highlight'
import { ListItem } from '../list/list-item'
import { toggleAction } from '../../../lib/post-mail-action'

interface InboxCardProps {
  id: string
  icon?: ImageSourcePropType | React.ReactNode
  publicationDate?: string | null
  subject: string
  unread?: boolean
  senderName?: string | null
  bookmarked?: boolean | null
  testID?: string
  onPress(id: string): void
}

export function InboxCard({
  id,
  onPress,
  subject,
  publicationDate,
  icon,
  unread,
  bookmarked,
  senderName,
}: InboxCardProps) {
  const theme = useTheme()
  const [starred, setStarred] = useState<boolean>(false)
  useEffect(() => setStarred(!!bookmarked), [bookmarked])
  return (
    <PressableHighlight
      highlightColor={theme.shade.shade400}
      onPress={() => onPress(id)}
    >
      <ListItem
        title={senderName ?? ''}
        subtitle={subject}
        date={publicationDate ? new Date(publicationDate) : undefined}
        unread={unread}
        starred={starred}
        onStarPress={() => {
          toggleAction(!bookmarked ? 'bookmark' : 'unbookmark', id)
          setStarred(!bookmarked)
        }}
        icon={icon}
      />
    </PressableHighlight>
  )
}
