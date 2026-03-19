import { useMemo } from 'react'
import { IconButton, Menu } from '@contentful/f36-components'
import { MoreHorizontalIcon } from '@contentful/f36-icons'

import {
  type ChildNodeOrder,
  findNodes,
  type Tree,
  TreeNodeType,
} from './utils'

interface EditMenuProps {
  onEdit: () => void
  onRemove: () => void
  onMarkEntryAsPrimary: (nodeId: number, entryId: string) => void
  onPublish?: () => void
  onUnpublish?: () => void
  entryId?: string
  entryNodeId: number
  root: Tree
  isEntryNodePrimaryLocation?: boolean
  currentChildNodeOrder?: ChildNodeOrder
  onSetChildNodeOrder?: (order: ChildNodeOrder) => void
}

export const EditMenu = ({
  onEdit,
  onRemove,
  onMarkEntryAsPrimary,
  onPublish,
  onUnpublish,
  isEntryNodePrimaryLocation,
  entryId,
  entryNodeId,
  root,
  currentChildNodeOrder,
  onSetChildNodeOrder,
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
        {onPublish && <Menu.Item onClick={onPublish}>Publish</Menu.Item>}
        {onUnpublish && <Menu.Item onClick={onUnpublish}>Unpublish</Menu.Item>}
        {currentChildNodeOrder && onSetChildNodeOrder && (
          <Menu.Submenu placement="left-start">
            <Menu.SubmenuTrigger>Child order</Menu.SubmenuTrigger>
            <Menu.List>
              <Menu.Item
                onClick={() => {
                  onSetChildNodeOrder('manual')
                }}
              >
                {currentChildNodeOrder === 'manual' ? 'Manual ✅' : 'Manual'}
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  onSetChildNodeOrder('asc-title')
                }}
              >
                {currentChildNodeOrder === 'asc-title'
                  ? 'Title ascending (A-Z) ✅'
                  : 'Title ascending (A-Z)'}
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  onSetChildNodeOrder('desc-title')
                }}
              >
                {currentChildNodeOrder === 'desc-title'
                  ? 'Title descending (Z-A) ✅'
                  : 'Title descending (Z-A)'}
              </Menu.Item>
            </Menu.List>
          </Menu.Submenu>
        )}
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
