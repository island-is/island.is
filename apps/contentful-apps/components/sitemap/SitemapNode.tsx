import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Stack, Text } from '@contentful/f36-components'

import { ChevronDownIcon, ChevronRightIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { Tree, TreeNode, TreeNodeType } from './utils'
import { ReactNode, useEffect, useState } from 'react'
import { AddNodeButton } from './AddNodeButton'
import { EditMenu } from './EditMenu'

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
  const cma = useCMA()
  const sdk = useSDK<FieldExtensionSDK>()

  const [showChildNodes, setShowChildNodes] = useState(false)

  const [entries, setEntries] = useState<
    {
      id: string
      label: string
      slug: string
    }[]
  >([])

  useEffect(() => {
    if (!showChildNodes) {
      return
    }

    const entryNodes = node.childNodes.filter(
      (node) => node.type === TreeNodeType.ENTRY,
    )

    if (entryNodes.length === 0) {
      return
    }

    const fetchEntries = async () => {
      // TODO: chunk down request
      const response = await cma.entry.getMany({
        query: {
          content_type: 'organizationSubpage',
          include: 1,
          limit: 1000,
          'sys.id[in]': entryNodes
            .filter((node) => Boolean(node.entryId))
            .map((node) => node.entryId)
            .join(','),
        },
      })

      // TODO: fetch more if there is more
      setEntries(
        response.items.map((entry) => ({
          id: entry.sys.id as string,
          label: entry.fields.title[sdk.field.locale] as string,
          slug: entry.fields.slug[sdk.field.locale] as string,
        })),
      )
    }

    fetchEntries()
  }, [cma.entry, node.childNodes, sdk.field.locale, showChildNodes])

  const label: string | ReactNode =
    node.type !== TreeNodeType.ENTRY
      ? node.label
      : entries.find((entry) => entry.id === node.entryId)?.label || '...'
  const slug =
    node.type === TreeNodeType.CATEGORY
      ? node.slug
      : node.type === TreeNodeType.URL
      ? node.url
      : entries.find((entry) => entry.id === node.entryId)?.slug || '...'

  const isClickable = node.type !== TreeNodeType.URL

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
                visibility:
                  node.type === TreeNodeType.URL ? 'hidden' : 'visible',
              }}
            >
              {showChildNodes ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </div>

            <Stack
              flexDirection="column"
              spacing="none"
              alignItems="flex-start"
            >
              <Text fontSize="fontSizeL" fontWeight="fontWeightMedium">
                {label}
              </Text>
              <Text fontSize="fontSizeM">{slug}</Text>
            </Stack>
          </div>
        </div>
        <div>
          <EditMenu
            onEdit={() => {
              console.log('EDIT')
            }}
            onRemove={async () => {
              const confirmed = await sdk.dialogs.openConfirm({
                title: 'Are you sure?',
                message: `"${label}" and everything below it will be removed from the sitemap`,
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
