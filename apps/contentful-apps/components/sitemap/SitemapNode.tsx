import { useContext, useEffect, useState } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { DragHandle } from '@contentful/f36-components'
import { ChevronDownIcon, ChevronRightIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext } from '@dnd-kit/sortable'

import { AddNodeButton } from './AddNodeButton'
import { EditMenu } from './EditMenu'
import { EntryContext } from './entryContext'
import { SitemapNodeContent } from './SitemapNodeContent'
import { Tree, TreeNode, TreeNodeType } from './utils'
import * as styles from './SitemapNode.css'

interface SitemapNodeProps {
  node: TreeNode
  parentNode: Tree
  root: Tree
  indent?: number
  addNode: (parentNode: Tree, type: TreeNodeType, createNew?: boolean) => void
  removeNode: (parentNode: Tree, idOfNodeToRemove: number) => void
  updateNode: (parentNode: Tree, updatedNode: TreeNode) => void
  onMarkEntryAsPrimary: (nodeId: number, entryId: string) => void
}

export const SitemapNode = ({
  node,
  parentNode,
  indent = 0,
  root,
  addNode,
  removeNode,
  updateNode,
  onMarkEntryAsPrimary,
}: SitemapNodeProps) => {
  const sdk = useSDK<FieldExtensionSDK>()

  const [showChildNodes, setShowChildNodes] = useState(false)

  const { fetchEntries, updateEntry } = useContext(EntryContext)

  useEffect(() => {
    const entryNodes = node.childNodes.filter(
      (node) => node.type === TreeNodeType.ENTRY,
    )

    if (node.type === TreeNodeType.ENTRY) {
      entryNodes.push(node)
    }

    if (entryNodes.length === 0) {
      return
    }
    fetchEntries(
      entryNodes.map((entryNode) => (entryNode as { entryId: string }).entryId),
    )
  }, [fetchEntries, node, node.childNodes])

  const isClickable = node.type === TreeNodeType.CATEGORY

  const handleClick = () => {
    if (isClickable) {
      setShowChildNodes((prev) => !prev)
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: node.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className={styles.mainContainer}>
      <div
        className={styles.nodeContainer}
        ref={setNodeRef}
        style={style}
        {...attributes}
      >
        <DragHandle {...listeners} label="Drag handle" />
        <div className={styles.nodeInnerContainer}>
          <div
            tabIndex={isClickable ? 0 : undefined}
            style={{
              cursor: isClickable ? 'pointer' : undefined,
              width: '100%',
            }}
            onKeyDown={(ev) => {
              if (ev.key === ' ') {
                handleClick()
              }
            }}
            onClick={handleClick}
          >
            <div className={styles.contentContainer}>
              <div
                style={{
                  visibility: isClickable ? 'visible' : 'hidden',
                }}
              >
                {showChildNodes ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </div>
              <SitemapNodeContent node={node} />
            </div>
          </div>
          <div>
            <EditMenu
              entryId={
                node.type === TreeNodeType.ENTRY ? node.entryId : undefined
              }
              root={root}
              onMarkEntryAsPrimary={onMarkEntryAsPrimary}
              isEntryNodePrimaryLocation={
                node.type === TreeNodeType.ENTRY && node.primaryLocation
              }
              entryNodeId={node.id}
              onEdit={async () => {
                if (node.type === TreeNodeType.ENTRY) {
                  const entry = await sdk.navigator.openEntry(node.entryId, {
                    slideIn: { waitForClose: true },
                  })

                  if (entry?.entity) {
                    updateEntry(entry.entity)
                  }

                  return
                }

                const updatedNode = await sdk.dialogs.openCurrentApp({
                  parameters: {
                    node,
                  },
                  minHeight: 400,
                })
                updateNode(parentNode, updatedNode)
                return
              }}
              onRemove={async () => {
                const confirmed = await sdk.dialogs.openConfirm({
                  title: 'Are you sure?',
                  message: `Entry and everything below it will be removed`,
                })
                if (!confirmed) {
                  return
                }
                removeNode(parentNode, node.id)
              }}
            />
          </div>
        </div>
      </div>
      {showChildNodes && (
        <div
          className={styles.childNodeContainer}
          style={{
            paddingLeft: `${(indent + 1) * 16}px`,
          }}
        >
          <SortableContext items={node.childNodes.map((child) => child.id)}>
            {node.childNodes.map((child) => (
              <SitemapNode
                addNode={addNode}
                parentNode={node}
                removeNode={removeNode}
                updateNode={updateNode}
                key={child.id}
                node={child}
                indent={indent + 1}
                root={root}
                onMarkEntryAsPrimary={onMarkEntryAsPrimary}
              />
            ))}
          </SortableContext>
          <div className={styles.addNodeButtonContainer}>
            <AddNodeButton
              addNode={(type, createNew) => {
                addNode(node, type, createNew)
              }}
              options={
                indent > 1 || node.type === TreeNodeType.ENTRY
                  ? [TreeNodeType.ENTRY, TreeNodeType.URL]
                  : [
                      TreeNodeType.CATEGORY,
                      TreeNodeType.ENTRY,
                      TreeNodeType.URL,
                    ]
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}
