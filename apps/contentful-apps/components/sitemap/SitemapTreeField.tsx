import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
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
import { SitemapNode } from './SitemapNode'
import {
  addNode as addNodeUtil,
  type EntryType,
  findNodes,
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
    async (
      parentNode: Tree,
      type: TreeNodeType,
      createNew?: boolean,
      entryType?: EntryType,
    ) => {
      await addNodeUtil(parentNode, type, sdk, tree, createNew, entryType)
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
                  language={language}
                  status={status}
                />
              ))}
              {status !== 'published' && (
                <div className={styles.addNodeButtonContainer}>
                  <AddNodeButton
                    addNode={(type, createNew, entryType) => {
                      addNode(tree, type, createNew, entryType)
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
