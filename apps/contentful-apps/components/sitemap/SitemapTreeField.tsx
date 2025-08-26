import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import type { EntryProps } from 'contentful-management'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { FormControl, Radio } from '@contentful/f36-components'
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
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { AddNodeButton } from './AddNodeButton'
import { EntryContext, useEntryContext } from './entryContext'
import { MoveNodesButton } from './MoveNodesButton'
import { SitemapNode } from './SitemapNode'
import {
  addNode as addNodeUtil,
  type EntryType,
  findNodes,
  findParentNode,
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
  const [language, setLanguage] = useState<'is-IS' | 'en'>('is-IS')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [mode, setMode] = useState<'edit' | 'select'>('edit')
  const selectedNodesRef = useRef<TreeNode[]>([])

  useDebounce(
    () => {
      sdk.field.setValue(tree)
    },
    DEBOUNCE_TIME,
    [tree],
  )

  useEffect(() => {
    if (tree.childNodes.length < 1) {
      sdk.window.stopAutoResizer()
      sdk.window.updateHeight(200)
    } else {
      sdk.window.startAutoResizer()
    }

    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [sdk.window, tree.childNodes.length])

  const addNode = useCallback(
    async (
      parentNode: Tree,
      type: TreeNodeType,
      entries: Record<string, EntryProps>,
      createNew = false,
      entryType?: EntryType,
    ) => {
      await addNodeUtil(
        parentNode,
        type,
        sdk,
        tree,
        createNew,
        entryType,
        entries,
      )
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

  const moveNodesToBottom = useCallback(
    (nodes: TreeNode[], parentNode: Tree) => {
      for (const node of nodes) {
        const parent = findParentNode(tree, node.id)

        if (parent) {
          removeNodeUtil(parent, node.id, tree)
        }
      }

      parentNode.childNodes.push(...nodes)

      selectedNodesRef.current = []
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        const oldIndex = tree.childNodes.findIndex(
          (item) => item.id === active.id,
        )
        const newIndex = tree.childNodes.findIndex(
          (item) => item.id === over.id,
        )
        if (oldIndex >= 0 && newIndex >= 0) {
          setTree((prevTree) => ({
            ...prevTree,
            childNodes: arrayMove(tree.childNodes, oldIndex, newIndex),
          }))
        }
      }
    },
    [tree],
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tree.childNodes}
        strategy={verticalListSortingStrategy}
      >
        <EntryContext.Provider value={useEntryContext()}>
          <div>
            <div className={styles.topRowContainer}>
              <div className={styles.statusSelectorContainer}>
                <FormControl.Label>Preview mode</FormControl.Label>
                <div>
                  <div className={styles.statusSelector}>
                    <Radio
                      id="draft"
                      name="status"
                      value="draft"
                      isChecked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                    >
                      Draft
                    </Radio>
                    <Radio
                      id="published"
                      name="status"
                      value="published"
                      isChecked={status === 'published'}
                      onChange={() => setStatus('published')}
                    >
                      Published
                    </Radio>
                  </div>
                </div>
              </div>
              <div className={styles.languageSelectorContainer}>
                <FormControl.Label>Language </FormControl.Label>
                <div>
                  <div className={styles.languageSelector}>
                    <Radio
                      id="is"
                      name="language"
                      value="is"
                      isChecked={language === 'is-IS'}
                      onChange={() => setLanguage('is-IS')}
                    >
                      Icelandic
                    </Radio>
                    <Radio
                      id="en"
                      name="language"
                      value="en"
                      isChecked={language === 'en'}
                      onChange={() => setLanguage('en')}
                    >
                      English
                    </Radio>
                  </div>
                </div>
              </div>
            </div>
            {status !== 'published' && (
              <div className={styles.modeSelectorContainer}>
                <FormControl.Label>Actions</FormControl.Label>
                <div>
                  <div className={styles.modeSelector}>
                    <Radio
                      id="edit"
                      name="mode"
                      value="edit"
                      isChecked={mode === 'edit'}
                      onChange={() => setMode('edit')}
                    >
                      Edit
                    </Radio>
                    <Radio
                      id="select"
                      name="mode"
                      value="select"
                      isChecked={mode === 'select'}
                      onChange={() => setMode('select')}
                    >
                      Select
                    </Radio>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.childNodeContainer}>
              {tree.childNodes.map((node) => (
                <SitemapNode
                  parentNode={tree}
                  removeNode={removeNode}
                  addNode={addNode}
                  updateNode={updateNode}
                  moveNodesToBottom={moveNodesToBottom}
                  key={`${node.id}-${selectedNodesRef.current.findIndex(
                    (n) => n.id === node.id,
                  )}`}
                  node={node}
                  root={tree}
                  onMarkEntryAsPrimary={onMarkEntryAsPrimary}
                  language={language}
                  status={status}
                  mode={mode}
                  selectedNodesRef={selectedNodesRef}
                />
              ))}
              {status !== 'published' && mode === 'edit' && (
                <div className={styles.addNodeButtonContainer}>
                  <AddNodeButton
                    addNode={(type, entries, createNew, entryType) => {
                      addNode(tree, type, entries, createNew, entryType)
                    }}
                  />
                </div>
              )}
              {mode === 'select' && (
                <div className={styles.addNodeButtonContainer}>
                  <MoveNodesButton
                    selectedNodes={selectedNodesRef.current}
                    currentNodeId={tree.id}
                    onClick={() => {
                      moveNodesToBottom(selectedNodesRef.current, tree)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </EntryContext.Provider>
      </SortableContext>
    </DndContext>
  )
}
