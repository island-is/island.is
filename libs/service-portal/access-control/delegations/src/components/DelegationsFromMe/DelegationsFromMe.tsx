import { useQuery } from '@apollo/client'

import {
  Box,
  SkeletonLoader,
  GridRow,
  GridColumn,
  GridContainer,
} from '@island.is/island-ui/core'
import { Query, AuthCustomDelegation } from '@island.is/api/schema'
import { useNamespaces } from '@island.is/localization'
import { DelegationsHeader } from '../DelegationsHeader'
import { AuthDelegationsQuery } from '../../lib/queries'
import { AccessCards } from '../AccessCards'

export const DelegationsFromMe = () => {
  useNamespaces('sp.settings-access-control')
  const { data, loading } = useQuery<Query>(AuthDelegationsQuery)

  const authDelegations = (data?.authDelegations ??
    []) as AuthCustomDelegation[]

  return (
    <GridContainer>
      <GridRow>
        <GridColumn paddingBottom={4} span="12/12">
          <DelegationsHeader
            onSystemChange={() => {
              // TODO implement system
            }}
          />
        </GridColumn>
        <GridColumn paddingBottom={4} span="12/12">
          {loading ? (
            <SkeletonLoader width="100%" height={191} />
          ) : (
            <AccessCards delegations={authDelegations} />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
