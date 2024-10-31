import { useContext, useEffect, useState } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { ChevronDownIcon, ChevronRightIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

import { AddNodeButton } from './AddNodeButton'
import { EditMenu } from './EditMenu'
import { EntryContext } from './entryContext'
import { SitemapNodeContent } from './SitemapNodeContent'
import { Tree, TreeNode, TreeNodeType } from './utils'
import * as styles from './SitemapNode.css'

interface SitemapNodeProps {
  node: TreeNode
  parentNode: Tree
  indent?: number
  addNode: (parentNode: Tree, type: TreeNodeType) => void
  removeNode: (parentNode: Tree, idOfNodeToRemove: number) => void
}

export const SitemapNode = ({
  node,
  parentNode,
  indent = 0,
  addNode,
  removeNode,
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
    fetchEntries(entryNodes.map((entryNode) => entryNode.entryId))
  }, [fetchEntries, node])

  const isClickable =
    node.type !== TreeNodeType.URL &&
    !('type' in parentNode && parentNode.type === TreeNodeType.ENTRY)

  const handleClick = () => {
    if (isClickable) {
      setShowChildNodes((prev) => !prev)
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.nodeContainer}>
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
            }}
            onRemove={async () => {
              const confirmed = await sdk.dialogs.openConfirm({
                title: 'Are you sure?',
                message: `Entry and everything below it will be removed from the sitemap`,
              })
              if (!confirmed) {
                return
              }
              removeNode(parentNode, node.id)
            }}
          />
        </div>
      </div>
      {showChildNodes && (
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
              key={child.id}
              node={child}
              indent={indent + 1}
            />
          ))}
          <div className={styles.addNodeButtonContainer}>
            <AddNodeButton
              addNode={(type) => {
                addNode(node, type)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
