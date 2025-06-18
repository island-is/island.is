import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext } from '@dnd-kit/sortable'

import { AddNodeButton } from './AddNodeButton'
import { EntryContext, useEntryContext } from './entryContext'
import { SitemapNode } from './SitemapNode'
import {
  addNode as addNodeUtil,
  findNodes,
  findNodeParentAndIndex as findNodeParentAndIndexUtil,
  moveNode as moveNodeUtil,
  removeNode as removeNodeUtil,
  type Tree,
  TreeNode,
  TreeNodeType,
  updateNode as updateNodeUtil,
} from './utils'
import * as styles from './SitemapTreeField.css'

const DEBOUNCE_TIME = 100

export const SitemapTreeField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [tree, setTree] = useState<Tree | undefined>(
    sdk.field.getValue() || {
      id: 0,
      childNodes: [],
    },
  )

  useDebounce(
    () => {
      sdk.field.setValue(tree)
    },
    DEBOUNCE_TIME,
    [tree],
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [sdk.window, tree.childNodes.length])

  const addNode = useCallback(
    async (parentNode: Tree, type: TreeNodeType, createNew?: boolean) => {
      await addNodeUtil(parentNode, type, sdk, tree, createNew)
      setTree((prevTree) => ({
        ...prevTree,
      }))
    },
    [sdk, tree],
  )

  const removeNode = useCallback(
    (parentNode: Tree, idOfNodeToRemove: number) => {
      removeNodeUtil(parentNode, idOfNodeToRemove, tree)
      setTree((prevTree) => ({ ...prevTree }))
    },
    [tree],
  )

  const updateNode = useCallback((parentNode: Tree, updatedNode: TreeNode) => {
    updateNodeUtil(parentNode, updatedNode)
    setTree((prevTree) => ({ ...prevTree }))
  }, [])

  const onMarkEntryAsPrimary = useCallback(
    (nodeId: number, entryId: string) => {
      const nodes = findNodes(
        tree,
        (otherNode) =>
          otherNode.type === TreeNodeType.ENTRY && otherNode.entryId == entryId,
      )
      for (const node of nodes) {
        if (node.type === TreeNodeType.ENTRY) {
          node.primaryLocation = node.id === nodeId
        }
      }
      setTree((prevTree) => ({ ...prevTree }))
    },
    [tree],
  )

  const sensors = useSensors(useSensor(PointerSensor))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={(event: DragEndEvent) => {
        const { active, over } = event

        console.log('Drag end event:', { active, over })

        if (!over || active.id === over.id) {
          console.log('No valid drop target or same item')
          return
        }

        const activeId = Number(active.id)
        const overId = Number(over.id)

        console.log('Processing drag:', { activeId, overId })

        // Find the source parent and index
        const sourceInfo = findNodeParentAndIndexUtil(tree, activeId)
        if (!sourceInfo) {
          console.warn('Could not find source node:', activeId)
          return
        }

        // Find the target parent and index
        const targetInfo = findNodeParentAndIndexUtil(tree, overId)
        if (!targetInfo) {
          console.warn('Could not find target node:', overId)
          return
        }

        console.log('Source info:', sourceInfo)
        console.log('Target info:', targetInfo)

        // Don't allow dropping a node into itself or its descendants
        if (activeId === targetInfo.parent.id) {
          console.log('Cannot drop node into itself')
          return
        }

        // Move the node
        const success = moveNodeUtil(
          tree,
          activeId,
          targetInfo.parent.id,
          targetInfo.index,
        )

        if (success) {
          console.log('Node moved successfully')
          setTree((prevTree) => ({ ...prevTree }))
        } else {
          console.warn(
            'Failed to move node:',
            activeId,
            'to parent:',
            targetInfo.parent.id,
          )
        }
      }}
    >
      <EntryContext.Provider value={useEntryContext()}>
        <div>
          <div>
            <SortableContext items={tree.childNodes}>
              <div className={styles.childNodeContainer}>
                {tree.childNodes.map((node) => (
                  <SitemapNode
                    parentNode={tree}
                    removeNode={removeNode}
                    addNode={addNode}
                    updateNode={updateNode}
                    key={node.id}
                    node={node}
                    root={tree}
                    onMarkEntryAsPrimary={onMarkEntryAsPrimary}
                  />
                ))}
                <div className={styles.addNodeButtonContainer}>
                  <AddNodeButton
                    addNode={(type, createNew) => {
                      addNode(tree, type, createNew)
                    }}
                  />
                </div>
              </div>
            </SortableContext>
          </div>
        </div>
      </EntryContext.Provider>
    </DndContext>
  )
}
