import {
  SkeletonLoader,
  GridRow,
  GridColumn,
  GridContainer,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { DelegationsHeader } from '../DelegationsHeader'
import { AccessCards } from '../access'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { useAuthDelegationsQuery } from '@island.is/service-portal/graphql'

export const DelegationsFromMe = () => {
  const { data, loading } = useAuthDelegationsQuery()

  const authDelegations = (data?.authDelegations ??
    []) as AuthCustomDelegation[]

  return (
    <GridContainer>
      <GridRow>
        <GridColumn paddingBottom={4} span="12/12">
          <DelegationsHeader />
        </GridColumn>
        <GridColumn paddingBottom={4} span="12/12">
          {loading ? (
            <SkeletonLoader width="100%" height={191} />
          ) : authDelegations.length === 0 ? (
            <DelegationsEmptyState />
          ) : (
            <AccessCards delegations={authDelegations} />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
