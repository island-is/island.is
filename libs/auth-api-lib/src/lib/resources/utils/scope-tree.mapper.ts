import { ScopeTreeDTO } from '../dto/scope-tree.dto'
import { ScopeDTO } from '../dto/scope.dto'
import { ApiScopeGroup } from '../models/api-scope-group.model'
import { ApiScope } from '../models/api-scope.model'

export function mapToScopeTree(
  scopes: (ApiScope | ScopeDTO)[],
): ScopeTreeDTO[] {
  const groupChildren = new Map<string, ScopeTreeDTO[]>()
  const scopeTree: Array<ApiScope | ApiScopeGroup | ScopeDTO> = []

  for (const scope of scopes) {
    if (scope.group) {
      let children = groupChildren.get(scope.group.name)
      if (!children) {
        scopeTree.push(scope.group)
        children = []
        groupChildren.set(scope.group.name, children)
      }
      children.push(new ScopeTreeDTO(scope))
    } else {
      scopeTree.push(scope)
    }
  }

  return scopeTree
    .sort((a, b) => a.order - b.order)
    .map((node) => ({
      ...new ScopeTreeDTO(node),
      children: groupChildren.get(node.name),
    }))
}
