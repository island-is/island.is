import { useContext, useEffect, useMemo, useState } from 'react'
import { EntryProps } from 'contentful-management'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Badge,
  Box,
  Checkbox,
  DragHandle,
  Popover,
  Text,
} from '@contentful/f36-components'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LinkIcon,
} from '@contentful/f36-icons'
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { AddNodeButton } from './AddNodeButton'
import { EditMenu } from './EditMenu'
import { EntryContext } from './entryContext'
import { MoveNodesButton } from './MoveNodesButton'
import { SitemapNodeContent } from './SitemapNodeContent'
import {
  CATEGORY_DIALOG_MIN_HEIGHT,
  type EntryType,
  extractNodeContent,
  findEntryNodePaths,
  optionMap,
  Tree,
  TreeNode,
  TreeNodeType,
  URL_DIALOG_MIN_HEIGHT,
} from './utils'
import * as styles from './SitemapNode.css'

const entryTypeMap = {
  organizationParentSubpage: 'Organization Parent Subpage',
  organizationSubpage: 'Organization Subpage',
}

const getEntryStatus = (
  node: TreeNode,
  entries: Record<string, EntryProps>,
) => {
  if (node.type !== TreeNodeType.ENTRY) {
    return ''
  }

  const entry = entries[node.entryId]

  if (!entry) {
    return ''
  }

  const { archivedVersion, publishedVersion, version } = entry.sys

  if (archivedVersion) {
    return 'archived'
  }

  if (!publishedVersion) {
    return 'draft'
  }

  if (publishedVersion < version - 1) {
    return 'changed'
  }

  return 'published'
}

const getNodeStatus = (node: TreeNode, entries: Record<string, EntryProps>) => {
  if (node.type === TreeNodeType.ENTRY) {
    return getEntryStatus(node, entries)
  }

  if (node.type === TreeNodeType.CATEGORY || node.type === TreeNodeType.URL) {
    if (!node.status) {
      return 'draft'
    }

    if (node.status === 'published') {
      return 'published'
    }

    return 'draft'
  }

  return 'draft'
}

const getStatusVariant = (status: ReturnType<typeof getNodeStatus>) => {
  if (status === 'archived') {
    return 'negative'
  }
  if (status === 'draft') {
    return 'warning'
  }
  if (status === 'changed') {
    return 'primary'
  }
  return 'positive'
}

const PageTooltip = ({
  root,
  entryId,
  entries,
  type,
}: {
  root: Tree
  entryId: string
  entries: Record<string, EntryProps>
  type: 'showOnlyPrimaryLocation' | 'showAllExceptPrimaryLocation'
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const nodePaths = useMemo(
    () =>
      findEntryNodePaths(root, entryId, entries).filter(
        ({ node }) =>
          node.type === TreeNodeType.ENTRY &&
          (type === 'showOnlyPrimaryLocation'
            ? node.primaryLocation
            : !node.primaryLocation),
      ),
    [entries, entryId, root, type],
  )

  if (nodePaths.length === 0) {
    return null
  }

  return (
    <Popover isOpen={isOpen}>
      <Popover.Trigger>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(!isOpen)}
          tabIndex={0}
          role="button"
          aria-label="Show entry references"
          aria-expanded
          onKeyDown={(ev: React.KeyboardEvent<HTMLDivElement>) => {
            if (ev.key === ' ') {
              ev.preventDefault()
              setIsOpen(!isOpen)
            }
          }}
        >
          <LinkIcon
            variant={type === 'showOnlyPrimaryLocation' ? 'muted' : 'primary'}
            size="small"
          />
        </div>
      </Popover.Trigger>
      <Popover.Content>
        <div className={styles.tooltipContent}>
          <Text fontWeight="fontWeightDemiBold">
            This entry is duplicated in the sitemap:
          </Text>
          {nodePaths.map((nodePath) => {
            const path = nodePath.path.join(' / ')
            return (
              <div key={path}>
                <Text>{path}</Text>
              </div>
            )
          })}
        </div>
      </Popover.Content>
    </Popover>
  )
}

interface SitemapNodeProps {
  node: TreeNode
  parentNode: Tree
  root: Tree
  indent?: number
  addNode: (
    parentNode: Tree,
    type: TreeNodeType,
    entries: Record<string, EntryProps>,
    createNew: boolean,
    entryType?: EntryType,
  ) => void
  removeNode: (parentNode: Tree, idOfNodeToRemove: number) => void
  updateNode: (parentNode: Tree, updatedNode: TreeNode) => void
  onMarkEntryAsPrimary: (nodeId: number, entryId: string) => void
  moveNodesToBottom: (nodes: TreeNode[], parentNode: Tree) => void
  language: 'is-IS' | 'en'
  status: 'draft' | 'published'
  mode: 'edit' | 'select'
  selectedNodesRef: React.RefObject<TreeNode[]>
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
  moveNodesToBottom,
  language,
  status,
  mode,
  selectedNodesRef,
}: SitemapNodeProps) => {
  const sdk = useSDK<FieldExtensionSDK>()

  const [showChildNodes, setShowChildNodes] = useState(false)

  const { fetchEntries, updateEntry, entries } = useContext(EntryContext)
  const [isChecked, setIsChecked] = useState(false)
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
  const { attributes, listeners, setNodeRef, transition, transform } =
    useSortable({
      id: node.id,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = node.childNodes.findIndex(
        (item) => item.id === active.id,
      )
      const newIndex = node.childNodes.findIndex((item) => item.id === over.id)
      if (oldIndex >= 0 && newIndex >= 0) {
        updateNode(parentNode, {
          ...node,
          childNodes: arrayMove(node.childNodes, oldIndex, newIndex),
        })
      }
    }
  }

  const nodeStatus = getNodeStatus(node, entries)

  const nodeContent = extractNodeContent(node, language, entries)

  if (
    status === 'published' &&
    ((nodeStatus !== 'published' && nodeStatus !== 'changed') ||
      !nodeContent.label)
  ) {
    return null
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.nodeContainer} ref={setNodeRef} style={style}>
        {status !== 'published' && (
          <DragHandle {...listeners} {...attributes} label="Drag to reorder" />
        )}
        <div className={styles.nodeInnerContainer}>
          <div className={styles.fullWidth}>
            <div className={styles.nodeTopRowContainer}>
              <div className={styles.nodeTopRowContainerLeft}>
                <Text fontColor="gray600">
                  {node.type === TreeNodeType.ENTRY
                    ? entryTypeMap[nodeContent.entryContentType]
                    : optionMap[node.type]}
                </Text>
                {node.type === TreeNodeType.ENTRY && language === 'is-IS' && (
                  <PageTooltip
                    root={root}
                    entryId={node.entryId}
                    entries={entries}
                    type={
                      !node.primaryLocation
                        ? 'showOnlyPrimaryLocation'
                        : 'showAllExceptPrimaryLocation'
                    }
                  />
                )}
              </div>

              <div className={styles.nodeTopRowContainerRight}>
                {nodeStatus && (
                  <Badge variant={getStatusVariant(nodeStatus)}>
                    {nodeStatus}
                  </Badge>
                )}
                {mode === 'select' && (
                  <Box padding="spacingS">
                    <Checkbox
                      isChecked={isChecked}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          selectedNodesRef.current.push(node)
                          setIsChecked(true)
                        } else {
                          setIsChecked(false)
                          const index = selectedNodesRef.current.findIndex(
                            (n) => n.id === node.id,
                          )
                          if (index >= 0) {
                            selectedNodesRef.current.splice(index, 1)
                          }
                        }
                      }}
                    />
                  </Box>
                )}
                <div
                  style={{
                    display: mode === 'select' ? 'none' : 'block',
                    visibility: status === 'published' ? 'hidden' : 'visible',
                  }}
                >
                  <EditMenu
                    entryId={
                      node.type === TreeNodeType.ENTRY
                        ? node.entryId
                        : undefined
                    }
                    root={root}
                    onMarkEntryAsPrimary={onMarkEntryAsPrimary}
                    isEntryNodePrimaryLocation={
                      node.type === TreeNodeType.ENTRY && node.primaryLocation
                    }
                    entryNodeId={node.id}
                    onPublish={
                      (node.type === TreeNodeType.CATEGORY ||
                        node.type === TreeNodeType.URL) &&
                      node.status !== 'published'
                        ? async () => {
                            const updatedNode = {
                              ...node,
                              status: 'published' as const,
                            }
                            updateNode(parentNode, updatedNode)
                          }
                        : undefined
                    }
                    onUnpublish={
                      (node.type === TreeNodeType.CATEGORY ||
                        node.type === TreeNodeType.URL) &&
                      node.status === 'published'
                        ? async () => {
                            const updatedNode = {
                              ...node,
                              status: 'draft' as const,
                            }
                            updateNode(parentNode, updatedNode)
                          }
                        : undefined
                    }
                    onEdit={async () => {
                      if (node.type === TreeNodeType.ENTRY) {
                        const entry = await sdk.navigator.openEntry(
                          node.entryId,
                          {
                            slideIn: { waitForClose: true },
                          },
                        )

                        if (entry?.entity) {
                          updateEntry(entry.entity)
                        }

                        return
                      }

                      const otherCategoriesAndEntryNodes =
                        parentNode.childNodes.filter(
                          (child) =>
                            (child.type === TreeNodeType.CATEGORY ||
                              child.type === TreeNodeType.ENTRY) &&
                            child.id !== node.id,
                        )

                      const otherSlugs = otherCategoriesAndEntryNodes
                        .map((child) =>
                          child.type === TreeNodeType.CATEGORY
                            ? child.slug
                            : child.type === TreeNodeType.ENTRY
                            ? entries[child.entryId]?.fields?.slug?.['is-IS']
                            : '',
                        )
                        .filter(Boolean)

                      const otherSlugsEN = otherCategoriesAndEntryNodes
                        .map((child) =>
                          child.type === TreeNodeType.CATEGORY
                            ? child.slugEN
                            : child.type === TreeNodeType.ENTRY
                            ? entries[child.entryId]?.fields?.slug?.['en']
                            : '',
                        )
                        .filter(Boolean)

                      const updatedNode = await sdk.dialogs.openCurrentApp({
                        parameters: {
                          node,
                          otherSlugs,
                          otherSlugsEN,
                        },
                        minHeight:
                          node.type === TreeNodeType.URL
                            ? URL_DIALOG_MIN_HEIGHT
                            : CATEGORY_DIALOG_MIN_HEIGHT,
                      })

                      if (!updatedNode) {
                        return
                      }

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
            <div
              tabIndex={isClickable ? 0 : undefined}
              style={{
                cursor: isClickable ? 'pointer' : undefined,
                width: '100%',
              }}
              onKeyDown={(ev: React.KeyboardEvent<HTMLDivElement>) => {
                if (ev.key === ' ') {
                  handleClick()
                }
              }}
              onClick={handleClick}
              className={styles.contentContainer}
            >
              <div
                style={{
                  visibility: isClickable ? 'visible' : 'hidden',
                }}
              >
                {showChildNodes ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </div>
              <SitemapNodeContent node={node} language={language} />
            </div>
          </div>
        </div>
      </div>
      {showChildNodes && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={node.childNodes}
            strategy={verticalListSortingStrategy}
          >
            <div
              className={styles.childNodeContainer}
              style={{
                paddingLeft: `${(indent + 1) * 16}px`,
              }}
            >
              {node.childNodes.map((child) => (
                <SitemapNode
                  addNode={addNode}
                  parentNode={node}
                  removeNode={removeNode}
                  updateNode={updateNode}
                  key={`${child.id}-${selectedNodesRef.current.findIndex(
                    (n) => n.id === child.id,
                  )}`}
                  node={child}
                  indent={indent + 1}
                  root={root}
                  onMarkEntryAsPrimary={onMarkEntryAsPrimary}
                  language={language}
                  status={status}
                  mode={mode}
                  selectedNodesRef={selectedNodesRef}
                  moveNodesToBottom={moveNodesToBottom}
                />
              ))}
              {status !== 'published' && mode === 'edit' && (
                <div className={styles.addNodeButtonContainer}>
                  <AddNodeButton
                    addNode={(type, entries, createNew, entryType) => {
                      addNode(node, type, entries, createNew, entryType)
                    }}
                    options={
                      indent > 0 || node.type === TreeNodeType.ENTRY
                        ? [TreeNodeType.ENTRY, TreeNodeType.URL]
                        : [
                            TreeNodeType.CATEGORY,
                            TreeNodeType.ENTRY,
                            TreeNodeType.URL,
                          ]
                    }
                  />
                </div>
              )}
              {mode === 'select' && (
                <div className={styles.addNodeButtonContainer}>
                  <MoveNodesButton
                    selectedNodes={selectedNodesRef.current}
                    currentNodeId={node.id}
                    onClick={() => {
                      moveNodesToBottom(selectedNodesRef.current, node)
                    }}
                  />
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
