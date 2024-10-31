import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Button } from '@contentful/f36-components'
import { JsonEditor } from '@contentful/field-editor-json'
import { useSDK } from '@contentful/react-apps-toolkit'

import { AddNodeButton } from './AddNodeButton'
import { EntryContext, useEntryContext } from './entryContext'
import { SitemapNode } from './SitemapNode'
import {
  addNode as addNodeUtil,
  removeNode as removeNodeUtil,
  type Tree,
  TreeNodeType,
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
  }, [sdk.window])

  const addNode = useCallback(
    async (parentNode: Tree, type: TreeNodeType) => {
      await addNodeUtil(parentNode, type, sdk, tree)
      setTree((prevTree) => ({
        ...prevTree,
      }))
    },
    [sdk, tree],
  )

  const removeNode = useCallback(
    (parentNode: Tree, idOfNodeToRemove: number) => {
      removeNodeUtil(parentNode, idOfNodeToRemove)
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
