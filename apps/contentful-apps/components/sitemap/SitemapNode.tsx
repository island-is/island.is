import { useContext, useEffect, useState } from 'react'
import { EntryProps } from 'contentful-management'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Badge, DragHandle, Popover, Text } from '@contentful/f36-components'
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

const getCategoryStatus = (node: TreeNode) => {
  if (node.type !== TreeNodeType.CATEGORY) {
    return ''
  }

  // If no status is set, default to draft
  if (!node.status) {
    return 'draft'
  }

  // If status is explicitly set, use it
  if (node.status === 'published') {
    return 'published'
  }

  // Check if there are unpublished changes
  if (
    node.version &&
    node.publishedVersion &&
    node.version > node.publishedVersion
  ) {
    return 'changed'
  }

  return node.status
}

const getNodeStatus = (node: TreeNode, entries: Record<string, EntryProps>) => {
  if (node.type === TreeNodeType.ENTRY) {
    return getEntryStatus(node, entries)
  }

  if (node.type === TreeNodeType.CATEGORY) {
    return getCategoryStatus(node)
  }

  return ''
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

  const nodePaths = findEntryNodePaths(root, entryId, entries).filter(
    ({ node }) =>
      node.type === TreeNodeType.ENTRY &&
      (type === 'showOnlyPrimaryLocation'
        ? node.primaryLocation
        : !node.primaryLocation),
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
          onKeyDown={(ev: React.KeyboardEvent<HTMLDivElement>) => {
            if (ev.key === ' ') {
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
            {type === 'showOnlyPrimaryLocation'
              ? 'This entry points to:'
              : `${nodePaths.length} other entries point to this entry:`}
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
    createNew?: boolean,
    entryType?: EntryType,
  ) => void
  removeNode: (parentNode: Tree, idOfNodeToRemove: number) => void
  updateNode: (parentNode: Tree, updatedNode: TreeNode) => void
  onMarkEntryAsPrimary: (nodeId: number, entryId: string) => void
  language: 'is-IS' | 'en'
  status: 'draft' | 'published'
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
  language,
  status,
}: SitemapNodeProps) => {
  const sdk = useSDK<FieldExtensionSDK>()

  const [showChildNodes, setShowChildNodes] = useState(false)

  const { fetchEntries, updateEntry, entries } = useContext(EntryContext)

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

  if (
    status === 'published' &&
    (nodeStatus !== 'published' ||
      !extractNodeContent(node, language, entries)?.label)
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
                    ? entryTypeMap[
                        node.contentType ?? 'organizationParentSubpage'
                      ]
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
                <div
                  style={{
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
                      node.type === TreeNodeType.CATEGORY &&
                      node.status !== 'published'
                        ? async () => {
                            const nextVersion = (node.version || 1) + 1
                            const updatedNode = {
                              ...node,
                              status: 'published' as const,
                              version: nextVersion,
                              publishedVersion: nextVersion,
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

                      const otherCategories = parentNode.childNodes.filter(
                        (child) =>
                          child.type === TreeNodeType.CATEGORY &&
                          child.id !== node.id,
                      )

                      const updatedNode = await sdk.dialogs.openCurrentApp({
                        parameters: {
                          node,
                          otherCategorySlugs: otherCategories
                            .map((child) =>
                              child.type === TreeNodeType.CATEGORY
                                ? child.slug
                                : '',
                            )
                            .filter(Boolean),
                          otherCategorySlugsEN: otherCategories
                            .map((child) =>
                              child.type === TreeNodeType.CATEGORY
                                ? child.slugEN
                                : '',
                            )
                            .filter(Boolean),
                        },
                        minHeight:
                          node.type === TreeNodeType.URL
                            ? URL_DIALOG_MIN_HEIGHT
                            : CATEGORY_DIALOG_MIN_HEIGHT,
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
                {showChildNodes || status === 'published' ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </div>
              <SitemapNodeContent node={node} language={language} />
            </div>
          </div>
        </div>
      </div>
      {(showChildNodes || status === 'published') && (
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
                  key={child.id}
                  node={child}
                  indent={indent + 1}
                  root={root}
                  onMarkEntryAsPrimary={onMarkEntryAsPrimary}
                  language={language}
                  status={status}
                />
              ))}
              {status !== 'published' && (
                <div className={styles.addNodeButtonContainer}>
                  <AddNodeButton
                    addNode={(type, createNew, entryType) => {
                      addNode(node, type, createNew, entryType)
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
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
