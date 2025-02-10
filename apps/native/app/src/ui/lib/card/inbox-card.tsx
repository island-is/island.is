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
  onPress(id: string): void
}

export function InboxCard({
  id,
  onPress,
  subject,
  publicationDate,
  icon,
  unread,
  senderName,
  isUrgent = false,
}: InboxCardProps) {
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
        icon={icon}
      />
    </PressableHighlight>
  )
}
