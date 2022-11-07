import { AuthApiScope, AuthCustomDelegation } from '@island.is/api/schema'
import { Box, Divider } from '@island.is/island-ui/core'
import { AUTH_API_SCOPE_GROUP_TYPE, AuthScopeTree } from '../access.types'
import { AccessListHeader } from '../AccessListHeader'
import { AccessListItem } from '../AccessListItem'

import * as styles from './AccessList.css'

interface AccessListProps {
  delegation: AuthCustomDelegation
  scopeTree: AuthScopeTree
}

export const AccessList = ({ delegation, scopeTree }: AccessListProps) => {
  console.log('delegation', delegation, scopeTree)

  const renderScopeTree = (
    scopeTree: AuthScopeTree | AuthApiScope[],
    indent?: boolean,
  ) => {
    return scopeTree.map((scope) => {
      if (scope.__typename === AUTH_API_SCOPE_GROUP_TYPE && scope.children) {
        return (
          <div key={scope.name}>
            <AccessListItem
              key={scope.name}
              name={scope.name}
              description={scope.description}
            />
            <div className={styles.divider}>
              <Divider />
            </div>
            {renderScopeTree(scope.children, true)}
            <div className={styles.divider}>
              <Divider />
            </div>
          </div>
        )
      }

      return (
        <div key={scope.name}>
          <AccessListItem
            key={scope.name}
            indent={indent}
            name={scope.displayName}
            description={scope.description}
            validTo={'12.12.2022'}
          />
          <div className={styles.divider}>
            <Divider />
          </div>
        </div>
      )
    })
  }

  return (
    <Box>
      <AccessListHeader />
      {renderScopeTree(scopeTree)}
    </Box>
  )
}
