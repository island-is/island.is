import React from 'react'
import { gql } from '@apollo/client'
import { useLocation, useHistory } from 'react-router-dom'
import * as kennitala from 'kennitala'

import {
  Box,
  SkeletonLoader,
  GridRow,
  GridColumn,
  Stack,
  Button,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { AccessCard } from '../AccessCard'
import { useAuthDelegationsQuery } from '@island.is/service-portal/graphql'
import { ISLAND_DOMAIN } from '../../constants'

export const AuthDelegationsQuery = gql`
  query AuthDelegationsQuery {
    authDelegations {
      id
      type
      to {
        nationalId
        name
      }
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
  useNamespaces('sp.settings-access-control')
  const { pathname } = useLocation()
  const { data, loading } = useAuthDelegationsQuery({
    variables: {
      input: {
        domain: ISLAND_DOMAIN,
      },
    },
  })

  const history = useHistory()
  const { formatMessage } = useLocale()
  const { switchUser } = useAuth()

  const authDelegations = ((data || {}).authDelegations ||
    []) as AuthCustomDelegation[]

  return (
    <Box>
      <GridRow>
        <GridColumn paddingBottom={4} span="12/12">
          <Box
            display="flex"
            justifyContent="flexStart"
            flexDirection={['column', 'row']}
          >
            <Box>
              <Button
                variant="utility"
                size="small"
                onClick={() => switchUser()}
                icon="reload"
                iconType="outline"
              >
                {formatMessage({
                  id: 'sp.settings-access-control:home-switch-access',
                  defaultMessage: 'Skipta um notanda',
                })}
              </Button>
            </Box>
            <Box marginLeft={[0, 2]} marginTop={[2, 0]}>
              <Button
                onClick={() => history.push(`${pathname}/veita`)}
                variant="utility"
                size="small"
                icon="receipt"
                iconType="outline"
              >
                {formatMessage({
                  id: 'sp.settings-access-control:home-grant-access',
                  defaultMessage: 'Veita umboð',
                })}
              </Button>
            </Box>
          </Box>
        </GridColumn>
        <GridColumn paddingBottom={4} span="12/12">
          <Stack space={3}>
            {loading ? (
              <SkeletonLoader width="100%" height={206} />
            ) : (
              authDelegations.map((delegation) =>
                delegation.to ? (
                  <AccessCard
                    key={delegation.id}
                    title={delegation.to.name}
                    validTo={delegation.validTo}
                    description={kennitala.format(delegation.to.nationalId)}
                    tags={delegation.scopes.map((scope) => scope.displayName)}
                    href={`${pathname}/${delegation.id}`}
                    group="Ísland.is"
                  />
                ) : undefined,
              )
            )}
          </Stack>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default Accesses
