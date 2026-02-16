import React from 'react'
import { ImageSourcePropType } from 'react-native'
import { useTheme } from 'styled-components/native'
import { PressableHighlight } from '../../../components/pressable-highlight/pressable-highlight'
import { ListItem } from '../list/list-item'

interface InboxCardProps {
  id: string
  icon?: ImageSourcePropType | React.ReactNode
  publicationDate?: string | null
  subject: string
  unread?: boolean
  senderName?: string | null
  isUrgent?: boolean | null
  testID?: string
  bookmarked?: boolean | null
  selectable?: boolean
  selected?: boolean
  onPress(id: string): void
  onPressIcon?(id: string): void
  replyable?: boolean | null
}

export const InboxCard = ({
  id,
  onPress,
  onPressIcon,
  subject,
  publicationDate,
  icon,
  unread,
  senderName,
  bookmarked,
  replyable = false,
  isUrgent = false,
  selectable = false,
  selected = false,
}: InboxCardProps) => {
  const theme = useTheme()

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
        urgent={!!isUrgent}
        replyable={!!replyable}
        starred={!!bookmarked}
        icon={icon}
        selectable={selectable}
        selected={selected}
        onPressIcon={onPressIcon ? () => onPressIcon(id) : undefined}
      />
    </PressableHighlight>
  )
}
