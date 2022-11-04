import { AuthApiScope, AuthCustomDelegation } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { AUTH_API_SCOPE_GROUP_TYPE, AuthScopeTree } from './access.types'
import { AccessItemHeader } from './AccessItemHeader'
import { AccessListItem } from './AccessListItem'

interface AccessListProps {
  delegation: AuthCustomDelegation
  scopeTree: AuthScopeTree
}

export const AccessList = ({ delegation, scopeTree }: AccessListProps) => {
  console.log('delegation', delegation, scopeTree)

  const renderScopeTree = (scopeTree: AuthScopeTree | AuthApiScope[]) => {
    return scopeTree.map((scope) => {
      if (scope.__typename === AUTH_API_SCOPE_GROUP_TYPE && scope.children) {
        return (
          <Box key={scope.name}>
            <AccessListItem
              key={scope.name}
              name={scope.name}
              description={scope.description}
            />
            <Box>{renderScopeTree(scope.children)}</Box>
          </Box>
        )
      }

      return (
        <AccessListItem
          key={scope.name}
          name={scope.name}
          description={scope.description}
          validTo={'12.12.2022'}
        />
      )
    })
  }

  return (
    <Box>
      <AccessItemHeader />
      <Box>{renderScopeTree(scopeTree)}</Box>
    </Box>
  )
}
