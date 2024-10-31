import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Button } from '@contentful/f36-components'
import { JsonEditor } from '@contentful/field-editor-json'
import { useSDK } from '@contentful/react-apps-toolkit'

import { AddNodeButton } from './AddNodeButton'
import { EntryContext, useEntryContext } from './entryContext'
import { SitemapNode } from './SitemapNode'
import { generateId, type Tree, type TreeNode, TreeNodeType } from './utils'
import * as styles from './SitemapTreeField.css'

export const SitemapTreeField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [tree, setTree] = useState<Tree | undefined>(
    sdk.field.getValue() || {
      id: 0,
      type: 'entry',
      entryId: '',
      childNodes: [],
    },
  )

  useDebounce(
    () => {
      sdk.field.setValue(tree)
    },
    100,
    [tree],
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [sdk.window])

  const addNode = useCallback(
    async (parentNode: Tree, type: TreeNodeType) => {
      let entryId = ''

      let label = ''
      let slug = ''
      let description = ''

      let url = ''

      if (type === TreeNodeType.ENTRY) {
        const entry = await sdk.dialogs.selectSingleEntry<{
          sys: { id: string }
        } | null>({
          contentTypes: ['organizationSubpage'],
        })
        if (!entry?.sys?.id) {
          return
        }
        entryId = entry.sys.id
      } else if (type === TreeNodeType.CATEGORY) {
        const labelPrompt = await sdk.dialogs.openPrompt({
          title: 'Category',
          message: 'Label',
        })

        if (!labelPrompt || typeof labelPrompt !== 'string') {
          return
        }
        label = labelPrompt
        const slugPrompt = await sdk.dialogs.openPrompt({
          title: 'Category',
          message: 'Slug',
        })
        if (!slugPrompt || typeof slugPrompt !== 'string') {
          return
        }
        slug = slugPrompt
        const descriptionPrompt = await sdk.dialogs.openPrompt({
          title: 'Category',
          message: 'Description',
        })
        if (
          typeof descriptionPrompt === 'string' &&
          Boolean(descriptionPrompt)
        ) {
          description = descriptionPrompt
        }
      } else if (type === TreeNodeType.URL) {
        const labelPrompt = await sdk.dialogs.openPrompt({
          title: 'URL',
          message: 'Label',
        })

        if (!labelPrompt || typeof labelPrompt !== 'string') {
          return
        }
        label = labelPrompt

        const urlPrompt = await sdk.dialogs.openPrompt({
          title: 'URL',
          message: 'HREF',
        })

        if (!urlPrompt || typeof urlPrompt !== 'string') {
          return
        }
        url = urlPrompt
      }

      const node: TreeNode = {
        childNodes: [],
        id: generateId(tree),
        ...(type === TreeNodeType.ENTRY
          ? { type: TreeNodeType.ENTRY, entryId }
          : type === TreeNodeType.CATEGORY
          ? {
              type: TreeNodeType.CATEGORY,
              label,
              slug,
              description,
            }
          : {
              type: TreeNodeType.URL,
              label,
              url,
            }),
      }
      parentNode.childNodes = [...parentNode.childNodes].concat(node)
      setTree((prevTree) => ({
        ...prevTree,
      }))
    },
    [sdk.dialogs, tree],
  )

  const removeNode = useCallback(
    (parentNode: Tree, idOfNodeToRemove: number) => {
      parentNode.childNodes = parentNode.childNodes.filter(
        (node) => node.id !== idOfNodeToRemove,
      )
      setTree((prevTree) => ({ ...prevTree }))
    },
    [],
  )

  return (
    <EntryContext.Provider value={useEntryContext()}>
      <div>
        <div style={{ paddingBottom: '16px' }}>
          <Button
            onClick={() => {
              setTree({
                id: 0,
                childNodes: [],
              })
            }}
          >
            Reset
          </Button>
        </div>

        <div>
          <div className={styles.childNodeContainer}>
            {tree.childNodes.map((node) => (
              <SitemapNode
                parentNode={tree}
                removeNode={removeNode}
                addNode={addNode}
                key={node.id}
                node={node}
              />
            ))}
            <div className={styles.addNodeButtonContainer}>
              <AddNodeButton
                addNode={(type) => {
                  addNode(tree, type)
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '16px' }}>
          <JsonEditor field={sdk.field} isInitiallyDisabled={false} />
        </div>
      </div>
    </EntryContext.Provider>
  )
}
