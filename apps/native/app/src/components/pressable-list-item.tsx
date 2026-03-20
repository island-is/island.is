import React, { memo, useCallback, useMemo } from 'react'

import { DocumentCategory, DocumentV2 } from '@/graphql/types/schema'
import { useOrganizationsStore } from '@/stores/organizations-store'
import { InboxCard, ListItem, theme } from '@/ui'
import { Filters } from '../utils/inbox-filters'
import { router } from 'expo-router'
import { PressableHighlight } from './pressable-highlight/pressable-highlight'
import { testIDs } from '../utils/test-ids'

export type ListParams = Filters & { category?: DocumentCategory }

type PressableListItemProps = {
  item: DocumentV2
  listParams: ListParams
  selectable: boolean
  selectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  setSelectedState: React.Dispatch<React.SetStateAction<boolean>>
}

export const PressableListItem = memo(
  ({
    item,
    listParams,
    selectable,
    selectedItems,
    setSelectedItems,
    setSelectedState,
  }: PressableListItemProps) => {
    const { getOrganizationLogoUrl } = useOrganizationsStore()
    const isSelected = useMemo(() => selectable && selectedItems.includes(item.id), [selectable, selectedItems, item.id])
    const icon = useMemo(
      () =>
        item.sender.name
          ? getOrganizationLogoUrl(item.sender.name, 75)
          : undefined,
      [item.sender.name, getOrganizationLogoUrl],
    )

    const toggleSelectItem = useCallback(() => {
      if (isSelected) {
        setSelectedItems((prev) => prev.filter((id) => id !== item.id))
      } else {
        setSelectedItems((prev) => [...prev, item.id])
      }
    }, [isSelected, setSelectedItems, item.id])

    const onPress = useCallback(() => {
      if (selectable) {
        toggleSelectItem();
      } else {
        router.navigate({
          pathname: '/inbox/[id]',
          params: {
            id: item.id,
            title: item.sender.name,
            isUrgent: String(item.isUrgent),
            listParams: JSON.stringify(listParams),
          },
        })
      }
    }, [
      selectable,
      toggleSelectItem,
      listParams,
      item.id,
      item.sender.name,
      item.isUrgent,
    ])

    const onPressIcon = useCallback(() => {
      setSelectedState(true);
      toggleSelectItem();
    }, [toggleSelectItem, setSelectedState])

    return (
      <PressableHighlight
        highlightColor={theme.shade.shade100}
        onPress={onPress}
        testID={`${testIDs.INBOX_ITEM}_${item.id}`}
      >
        <ListItem
          title={item.sender.name ?? ''}
          subtitle={item.subject}
          date={
            item.publicationDate ? new Date(item.publicationDate) : undefined
          }
          unread={!item.opened}
          urgent={!!item.isUrgent}
          replyable={!!item.replyable}
          starred={!!item.bookmarked}
          icon={!selectable ? icon : null}
          selectable={selectable}
          selected={isSelected}
          onPressIcon={onPressIcon}
        />
      </PressableHighlight>
    )
  },
)
