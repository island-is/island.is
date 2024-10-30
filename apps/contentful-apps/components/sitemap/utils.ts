export enum TreeNodeType {
  ENTRY = 'entry',
  CATEGORY = 'category',
  URL = 'url',
}

export type TreeNode = Tree &
  (
    | {
        type: TreeNodeType.ENTRY
        entryId: string
      }
    | {
        type: TreeNodeType.CATEGORY
        label: string
        slug: string
        description: string
      }
    | {
        type: TreeNodeType.URL
        label: string
        url: string
      }
  )

export type Tree = {
  id: number
  childNodes: TreeNode[]
}

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
