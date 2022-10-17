import { useState } from 'react'
import { useSessionStorage } from 'react-use'
import {
  SkeletonLoader,
  GridRow,
  GridColumn,
  GridContainer,
  Stack,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { DelegationsHeader, DomainOption } from '../DelegationsHeader'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { useAuthDelegationsQuery } from '@island.is/service-portal/graphql'
import { useNamespaces, useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { AccessDeleteModal, AccessCard } from '../access'
import { isDefined } from '@island.is/shared/utils'
import { ISLAND_DOMAIN } from '../../constants'
import { ALL_DOMAINS } from '../../hooks/useDomains'

export const DelegationsFromMe = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const [domainName, setDomainName] = useSessionStorage<string | null>(
    'domain',
    ISLAND_DOMAIN,
  )
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
    null,
  )

  const { data, loading, refetch } = useAuthDelegationsQuery({
    variables: {
      input: {
        // TODO(snaer): In V2 this should start as null to get all delegations no matter the domain
        domain: domainName === ALL_DOMAINS ? null : domainName ?? ISLAND_DOMAIN,
      },
    },
    // Make sure that loading state is shown when refetching
    notifyOnNetworkStatusChange: true,
  })

  const authDelegations = (data?.authDelegations ??
    []) as AuthCustomDelegation[]

  const onDomainChange = (option: DomainOption) => {
    const domainName = option.value
    setDomainName(domainName)
    refetch({
      input: {
        domain: domainName,
      },
    })
  }

  return (
    <>
      <GridContainer>
        <GridRow>
          <GridColumn paddingBottom={4} span="12/12">
            <DelegationsHeader
              domainName={domainName}
              onDomainChange={onDomainChange}
            />
          </GridColumn>
          <GridColumn paddingBottom={4} span="12/12">
            {loading ? (
              <SkeletonLoader width="100%" height={191} />
            ) : authDelegations.length === 0 ? (
              <DelegationsEmptyState />
            ) : (
              <Stack space={3}>
                {authDelegations.map(
                  (delegation) =>
                    delegation.to && (
                      <AccessCard
                        key={delegation.id}
                        delegation={delegation}
                        group="Ísland.is"
                        onDelete={(delegation) => {
                          setDelegation(delegation)
                        }}
                      />
                    ),
                )}
              </Stack>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
      <AccessDeleteModal
        id={`access-delete-modal-${delegation?.id}`}
        onClose={() => {
          setDelegation(null)
        }}
        onDelete={() => {
          setDelegation(null)
          refetch()
        }}
        label={formatMessage(m.accessControl)}
        title={formatMessage({
          id: 'sp.settings-access-control:access-remove-modal-content',
          defaultMessage: 'Ertu viss um að þú viljir eyða þessum aðgangi?',
        })}
        isVisible={isDefined(delegation)}
        delegation={delegation as AuthCustomDelegation}
        domain={{
          name: 'Landsbankaappið',
          imgSrc: './assets/images/educationDegree.svg',
        }}
      />
    </>
  )
}
