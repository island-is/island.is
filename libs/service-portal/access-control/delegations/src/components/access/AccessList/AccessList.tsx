import { AuthApiScope, AuthDelegationScope } from '@island.is/api/schema'
import { Box, Divider } from '@island.is/island-ui/core'
import { AUTH_API_SCOPE_GROUP_TYPE, AuthScopeTree } from '../access.types'
import { AccessListHeader } from './AccessListHeader'
import { AccessListItem } from './AccessListItem'
import * as styles from './AccessList.css'

interface AccessListProps {
  validityPeriod?: Date | null
  scopes: Pick<AuthDelegationScope, 'name' | 'validTo' | 'displayName'>[]
  scopeTree: AuthScopeTree
}

export const AccessList = ({
  scopes,
  scopeTree,
  validityPeriod,
}: AccessListProps) => {
  const getDelegationScopeByName = (scopeName: string) =>
    scopes.find(({ name }) => name === scopeName)

  const renderScopeTree = (
    scopeTree: AuthScopeTree | AuthApiScope[],
    indent?: boolean,
  ) => {
    return scopeTree.map((scope) => {
      if (
        scope.__typename === AUTH_API_SCOPE_GROUP_TYPE &&
        scope.children?.some((childScope) =>
          getDelegationScopeByName(childScope.name),
        )
      ) {
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

      const delegationScope = getDelegationScopeByName(scope.name)

      if (delegationScope) {
        return (
          <div key={scope.name}>
            <AccessListItem
              key={scope.name}
              indent={indent}
              name={scope.displayName}
              description={scope.description}
              validTo={delegationScope.validTo}
              validityPeriod={validityPeriod}
            />
            <div className={styles.divider}>
              <Divider />
            </div>
          </div>
        )
      }

      return null
    })
  }

  return (
    <Box>
      <AccessListHeader validityPeriod={validityPeriod} />
      <div className={styles.divider}>
        <Divider />
      </div>
      {renderScopeTree(scopeTree)}
    </Box>
  )
}
