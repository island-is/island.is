import { FieldNode, GraphQLResolveInfo, SelectionSetNode } from 'graphql'

// See: https://github.com/graphql/graphql-js/tree/f851eba93167b04d6be1373ff27927b16352e202/src
// for language/ast.ts
// and
// https://github.com/graphql/graphql-js/blob/f851eba93167b04d6be1373ff27927b16352e202/src/type/definition.ts#L891-L902
// ---
// Uses a recursion helper to recursively drill down into the
// graphql AST for selection fields and returns the
// highest recursion depth reached
export const detectGraphqlDepthFromInfo = (
  info: GraphQLResolveInfo,
): number => {
  const fieldNodes = info.fieldNodes
  const depths = []
  for (const fieldNode of fieldNodes) {
    if (fieldNode?.selectionSet) {
      depths.push(getSelectionDepth(fieldNode.selectionSet))
    } else {
      depths.push(0)
    }
  }
  return Math.max(...depths)
}

const getSelectionDepth = (
  selectionSet: SelectionSetNode,
  depth = 0,
): number => {
  if (selectionSet?.selections?.length) {
    const depths = []
    for (const selection of selectionSet.selections as FieldNode[]) {
      if (selection?.selectionSet) {
        depths.push(getSelectionDepth(selection.selectionSet, depth + 1))
      }
      depths.push(depth)
    }
    return Math.max(...depths)
  }
  return depth
}
