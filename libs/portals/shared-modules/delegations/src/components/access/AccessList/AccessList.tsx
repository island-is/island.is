import { AuthApiScope, AuthDelegationScope } from '@island.is/api/schema'
import { Box, Divider, useBreakpoint } from '@island.is/island-ui/core'
import { AUTH_API_SCOPE_GROUP_TYPE, AuthScopeTree } from '../access.types'
import { AccessListHeader } from './AccessListHeader'
import { AccessListItem } from './AccessListItem'
import * as commonAccessStyles from '../access.css'
import { Fragment } from 'react'
import classNames from 'classnames'

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
  const { lg } = useBreakpoint()

  const getDelegationScopeByName = (scopeName: string) =>
    scopes.find(({ name }) => name === scopeName)

  const renderScopeTree = (
    scopeTree: AuthScopeTree | AuthApiScope[],
    indent?: boolean,
  ) => {
    return scopeTree.map((scope, scopeIndex) => {
      const isLastChild = scopeIndex === scopeTree.length - 1 && indent

      if (
        // Check if scope is a group
        scope.__typename === AUTH_API_SCOPE_GROUP_TYPE &&
        // Make sure the group children exist in the delegation scopes
        scope.children?.some((childScope) =>
          getDelegationScopeByName(childScope.name),
        )
      ) {
        return (
          <Fragment key={scope.name}>
            <AccessListItem
              key={scope.name}
              name={scope.name}
              description={scope.description}
            />
            <div className={commonAccessStyles.divider}>
              <Divider weight="faded" />
            </div>
            {renderScopeTree(scope.children, true)}
            <div className={commonAccessStyles.divider}>
              <Divider />
            </div>
          </Fragment>
        )
      }

      const delegationScope = getDelegationScopeByName(scope.name)

      if (delegationScope) {
        return (
          <Fragment key={scope.name}>
            <AccessListItem
              key={scope.name}
              indent={indent}
              name={scope.displayName}
              description={scope.description}
              validTo={delegationScope.validTo}
              validityPeriod={validityPeriod}
            />
            {!isLastChild && (
              <div className={commonAccessStyles.divider}>
                <Divider {...(indent && { weight: 'faded' })} />
              </div>
            )}
          </Fragment>
        )
      }

      return null
    })
  }

  return (
    <div
      className={classNames(
        commonAccessStyles.grid,
        validityPeriod
          ? commonAccessStyles.gridTwoCols
          : commonAccessStyles.gridThreeCols,
      )}
    >
      {lg && <AccessListHeader validityPeriod={validityPeriod} />}
      <Box className={commonAccessStyles.divider}>
        <Divider />
      </Box>
      {renderScopeTree(scopeTree)}
    </div>
  )
}
