import React, { memo } from 'react'

import { DocumentCategory, DocumentV2 } from '@/graphql/types/schema'
import { navigateTo } from '@/lib/deep-linking'
import { useOrganizationsStore } from '@/stores/organizations-store'
import { InboxCard } from '@/ui'
import { Filters } from '../_utils/inbox-filters'
import { router } from 'expo-router'

export type ListParams = Filters & { category?: DocumentCategory }

type PressableListItemProps = {
  item: DocumentV2
  listParams: ListParams
  selectable: boolean
  selectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  setSelectedState: React.Dispatch<React.SetStateAction<boolean>>
  isFeature2WayMailboxEnabled: boolean
}

export const PressableListItem = memo(
  ({
    item,
    listParams,
    selectable,
    selectedItems,
    setSelectedItems,
    setSelectedState,
    isFeature2WayMailboxEnabled,
  }: PressableListItemProps) => {
    const { getOrganizationLogoUrl } = useOrganizationsStore()
    const isSelected = selectable && selectedItems.includes(item.id)

    return (
      <InboxCard
        key={item.id}
        subject={item.subject}
        publicationDate={item.publicationDate}
        id={item.id}
        unread={!item.opened}
        senderName={item.sender.name}
        icon={item.sender.name && getOrganizationLogoUrl(item.sender.name, 75)}
        isUrgent={item.isUrgent}
        replyable={isFeature2WayMailboxEnabled ? item.replyable : false}
        bookmarked={item.bookmarked}
        selectable={selectable}
        selected={isSelected}
        onPressIcon={() => {
          setSelectedState((prev) => !prev)
          setSelectedItems([...selectedItems, item.id])
        }}
        onPress={() => {
          return selectable
            ? isSelected
              ? setSelectedItems(selectedItems.filter((id) => id !== item.id))
              : setSelectedItems([...selectedItems, item.id])
            : navigateTo(`/inbox/${item.id}`, {
                title: item.sender.name,
                isUrgent: item.isUrgent,
                listParams,
              });
        }
        }
      />
    )
  },
)
