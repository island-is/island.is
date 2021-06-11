import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useLocation, useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'

import {
  Box,
  SkeletonLoader,
  GridRow,
  GridColumn,
  Stack,
  Button,
} from '@island.is/island-ui/core'
import { Query, AuthCustomDelegation } from '@island.is/api/schema'
import { EmptyState } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

import { AccessCard } from '../AccessCard'

export const AuthDelegationsQuery = gql`
  query AuthDelegationsQuery {
    authDelegations {
      id
      type
      toNationalId
      fromName
      ... on AuthCustomDelegation {
        validTo
        scopes {
          id
          name
          displayName
          validTo
        }
      }
    }
  }
`

function Accesses(): JSX.Element {
  const { pathname } = useLocation()
  const { data, loading } = useQuery<Query>(AuthDelegationsQuery)
  const history = useHistory()
  const { formatMessage } = useLocale()

  const authDelegations = ((data || {}).authDelegations ||
    []) as AuthCustomDelegation[]

  return (
    <Box>
      <GridRow>
        <GridColumn paddingBottom={4} span="12/12">
          <Box display="flex" justifyContent="flexEnd">
            <Button onClick={() => history.push(`${pathname}/veita`)}>
              {formatMessage({
                id: 'service.portal.settings.accessControl:home-grant-access',
                defaultMessage: 'Veita aðgang',
              })}
            </Button>
          </Box>
        </GridColumn>
        <GridColumn paddingBottom={4} span="12/12">
          <Stack space={3}>
            {loading ? (
              <SkeletonLoader width="100%" height={206} />
            ) : authDelegations.length === 0 ? (
              <EmptyState
                title={defineMessage({
                  id: 'service.portal.settings.accessControl:home-no-data',
                  defaultMessage: 'Engin gögn fundust',
                })}
              />
            ) : (
              authDelegations.map((delegation) => (
                <AccessCard
                  key={delegation.id}
                  title={delegation.fromName}
                  validTo={delegation.validTo}
                  description={delegation.toNationalId}
                  tags={delegation.scopes.map((scope) => scope.displayName)}
                  href={`${pathname}/${delegation.toNationalId}`}
                  group="Ísland.is"
                />
              ))
            )}
          </Stack>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default Accesses
