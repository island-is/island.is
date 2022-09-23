import { gql, useQuery } from '@apollo/client'
import { useLocation, useHistory } from 'react-router-dom'

import {
  Box,
  SkeletonLoader,
  GridRow,
  GridColumn,
  Stack,
  Button,
  Select,
} from '@island.is/island-ui/core'
import { m, ServicePortalPath } from '@island.is/service-portal/core'
import { Query, AuthCustomDelegation } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { AccessCard } from '../AccessCard'
import * as styles from './Accesses.css'

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
  const { data, loading } = useQuery<Query>(AuthDelegationsQuery)
  const history = useHistory()
  const { formatMessage } = useLocale()

  const authDelegations = ((data || {}).authDelegations ||
    []) as AuthCustomDelegation[]

  const systemOptions = [
    {
      label: formatMessage({
        id: 'sp.access-control-delegations:all-systems',
        defaultMessage: 'Öll kerfi',
      }),
      value: 'all',
    },
    {
      label: 'Valmöguleiki 1',
      value: '0',
    },
    {
      label: 'Valmöguleiki 2',
      value: '1',
    },
  ]

  return (
    <Box>
      <GridRow>
        <GridColumn paddingBottom={4} span="12/12">
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
          >
            <div className={styles.selectContainer}>
              <Select
                label={formatMessage(m.accessControl)}
                size="xs"
                name="system"
                noOptionsMessage="Enginn valmöguleiki"
                defaultValue={systemOptions[0]}
                options={systemOptions}
                onChange={() => {
                  // TODO filter cards by system
                }}
                placeholder={formatMessage({
                  id: 'sp.access-control-delegations:choose-system',
                  defaultMessage: 'Veldu kerfi',
                })}
              />
            </div>
            <Button
              onClick={() =>
                history.push(ServicePortalPath.AccessControlDelegationsGrant)
              }
              variant="utility"
              size="small"
              icon="add"
              iconType="outline"
            >
              {formatMessage({
                id: 'sp.access-control-delegations:new-delegation',
                defaultMessage: 'Nýtt umboð',
              })}
            </Button>
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
                    tags={delegation.scopes.map((scope) => scope.displayName)}
                    href={`${pathname}/${delegation.id}`}
                    group="Ísland.is"
                    // TODO add conditional if card is editable
                    editable
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
