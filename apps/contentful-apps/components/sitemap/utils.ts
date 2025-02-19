import { FieldExtensionSDK } from '@contentful/app-sdk'

import {
  SitemapTree as Tree,
  SitemapTreeNode as TreeNode,
  SitemapTreeNodeType as TreeNodeType,
} from '@island.is/shared/types'

export { type Tree, type TreeNode, TreeNodeType }

export const ENTRY_CONTENT_TYPE_ID = 'organizationParentSubpage'

const getHighestId = (tree: Tree) => {
  let highestId = tree.id
  for (const child of tree.childNodes) {
    const highestChildId = getHighestId(child)
    if (highestChildId > highestId) {
      highestId = highestChildId
    }
  }
  return highestId
}

export const generateId = (tree: Tree) => {
  return getHighestId(tree) + 1
}

export const removeNode = async (
  parentNode: Tree,
  idOfNodeToRemove: number,
  root: Tree,
) => {
  const node = findNode(parentNode, (node) => node.id === idOfNodeToRemove)

  if (!node) {
    return
  }

  parentNode.childNodes = parentNode.childNodes.filter(
    (node) => node.id !== idOfNodeToRemove,
  )

  if (node.type === TreeNodeType.ENTRY && node.primaryLocation) {
    const otherNodesWithSameEntryId = findNodes(
      root,
      (otherNode) =>
        otherNode.id !== idOfNodeToRemove &&
        otherNode.type === TreeNodeType.ENTRY &&
        otherNode.entryId === node.entryId,
    )

    if (otherNodesWithSameEntryId.length > 0) {
      for (const otherNode of otherNodesWithSameEntryId) {
        if (otherNode.type === TreeNodeType.ENTRY) {
          otherNode.primaryLocation = true
          return
        }
      }
    }
  }
}

const findNodeRecursive = (
  node: TreeNode,
  condition: (otherNode: TreeNode) => boolean,
): TreeNode => {
  if (condition(node)) {
    return node
  }
  for (const child of node.childNodes) {
    const nodeInChildTree = findNodeRecursive(child, condition)
    if (nodeInChildTree) return nodeInChildTree
  }
  return null
}

export const findNode = (
  root: Tree,
  condition: (otherNode: TreeNode) => boolean,
) => {
  for (const child of root.childNodes) {
    const node = findNodeRecursive(child, condition)
    if (node) return node
  }
  return null
}

const findNodesRecursive = (
  node: TreeNode,
  condition: (otherNode: TreeNode) => boolean,
) => {
  const nodes: TreeNode[] = []
  if (condition(node)) {
    nodes.push(node)
  }
  for (const child of node.childNodes) {
    for (const childNode of findNodesRecursive(child, condition)) {
      nodes.push(childNode)
    }
  }
  return nodes
}

export const findNodes = (
  root: Tree,
  condition: (otherNode: TreeNode) => boolean,
) => {
  const nodes: TreeNode[] = []
  for (const child of root.childNodes) {
    for (const node of findNodesRecursive(child, condition)) {
      nodes.push(node)
    }
  }
  return nodes
}

export const addNode = async (
  parentNode: Tree,
  type: TreeNodeType,
  sdk: FieldExtensionSDK,
  root: Tree,
  createNew?: boolean,
) => {
  let entryId = ''

  let label = ''
  let slug = ''
  let description = ''

  let url = ''

  if (type === TreeNodeType.ENTRY) {
    if (createNew) {
      const entry = await sdk.navigator.openNewEntry(ENTRY_CONTENT_TYPE_ID, {
        slideIn: { waitForClose: true },
      })
      if (!entry?.entity?.sys?.id) {
        return
      }
      entryId = entry.entity.sys.id
    } else {
      const entry = await sdk.dialogs.selectSingleEntry<{
        sys: { id: string }
      } | null>({
        contentTypes: [ENTRY_CONTENT_TYPE_ID],
      })
      if (!entry?.sys?.id) {
        return
      }

      const parentIsEntry =
        'type' in parentNode && parentNode.type === TreeNodeType.ENTRY

      if (
        parentIsEntry &&
        'entryId' in parentNode &&
        entry.sys.id === parentNode.entryId
      ) {
        sdk.dialogs.openAlert({
          title: 'Invalid entry selected',
          message: 'You can not place the same page below itself!',
        })
        return
      }

      entryId = entry.sys.id
    }
  } else if (type === TreeNodeType.CATEGORY) {
    const data = await sdk.dialogs.openCurrentApp({
      parameters: {
        node: {
          type: TreeNodeType.CATEGORY,
          label: '',
          description: '',
          slug: '',
        },
      },
      minHeight: 400,
    })

    if (!data) {
      return
    }

    label = data.label
    slug = data.slug
    description = data.description
  } else if (type === TreeNodeType.URL) {
    const data = await sdk.dialogs.openCurrentApp({
      parameters: {
        node: {
          type: TreeNodeType.URL,
          url: '',
        },
      },
      minHeight: 400,
    })

    if (!data) {
      return
    }

    label = data.label
    url = data.url
  }

  const node: TreeNode = {
    childNodes: [],
    id: generateId(root),
    ...(type === TreeNodeType.ENTRY
      ? {
          type: TreeNodeType.ENTRY,
          entryId,
          // It's the primary location if the same entry isn't already present in the sitemap
          primaryLocation: !findNode(
            root,
            (otherNode) =>
              otherNode.type === TreeNodeType.ENTRY &&
              otherNode.entryId === entryId,
          ),
        }
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
}

export const updateNode = (parentNode: Tree, updatedNode: TreeNode) => {
  const nodeIndex = parentNode.childNodes.findIndex(
    (node) => node.id === updatedNode.id,
  )
  if (nodeIndex >= 0) {
    parentNode.childNodes[nodeIndex] = updatedNode
  }
}
