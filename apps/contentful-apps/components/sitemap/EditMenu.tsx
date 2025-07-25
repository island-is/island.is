import { useMemo } from 'react'
import { IconButton, Menu } from '@contentful/f36-components'
import { MoreHorizontalIcon } from '@contentful/f36-icons'

import { findNodes, type Tree, TreeNodeType } from './utils'

interface EditMenuProps {
  onEdit: () => void
  onRemove: () => void
  onMarkEntryAsPrimary: (nodeId: number, entryId: string) => void
  entryId?: string
  entryNodeId: number
  root: Tree
  isEntryNodePrimaryLocation?: boolean
}

export const EditMenu = ({
  onEdit,
  onRemove,
  onMarkEntryAsPrimary,
  isEntryNodePrimaryLocation,
  entryId,
  entryNodeId,
  root,
}: EditMenuProps) => {
  const sameEntryNodes = useMemo(() => {
    if (!entryId || !entryNodeId) return []
    return findNodes(
      root,
      (otherNode) =>
        otherNode.type === TreeNodeType.ENTRY && otherNode.entryId === entryId,
    )
  }, [entryId, entryNodeId, root])

  return (
    <Menu>
      <Menu.Trigger>
        <IconButton icon={<MoreHorizontalIcon />} aria-label="Edit" />
      </Menu.Trigger>
      <Menu.List>
        <Menu.Item onClick={onEdit}>Edit</Menu.Item>
        {sameEntryNodes.length > 1 && (
          <Menu.Item
            disabled={isEntryNodePrimaryLocation}
            style={{
              cursor: isEntryNodePrimaryLocation ? undefined : 'pointer',
            }}
            onClick={() => {
              if (isEntryNodePrimaryLocation) return
              onMarkEntryAsPrimary(entryNodeId, entryId)
            }}
          >
            {isEntryNodePrimaryLocation
              ? 'Marked as primary ✅'
              : 'Mark as primary'}
          </Menu.Item>
        )}
        <Menu.Item onClick={onRemove}>Remove</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
