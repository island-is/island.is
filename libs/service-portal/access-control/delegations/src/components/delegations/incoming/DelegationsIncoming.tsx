import { useMemo, useState } from 'react'
import {
  SkeletonLoader,
  Stack,
  AlertBanner,
  Box,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { useAuthActorDelegationsQuery } from '@island.is/service-portal/graphql'
import { DomainOption, useDomains } from '../../../hooks/useDomains'
import { ALL_DOMAINS } from '../../../constants/domain'
import { DelegationsIncomingHeader } from './DelegationsIncomingHeader'
import { AccessDeleteModal } from '../../access/AccessDeleteModal'
import { AccessCard } from '../../access/AccessCard'
import { DelegationsEmptyState } from '../DelegationsEmptyState'

import { isDefined } from 'class-validator'

export const DelegationsIncoming = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const { domainName, updateDomainName } = useDomains()
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
    null,
  )
  const { data, loading, refetch, error } = useAuthActorDelegationsQuery({
    variables: {
      input: {
        //domain: domainName,
      },
      lang,
    },
    // Make sure that loading state is shown when refetching
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  })

  const delegations = useMemo(
    () => (data?.authActorDelegations as AuthCustomDelegation[]) ?? [],
    [data?.authActorDelegations],
  )

  const onDomainChange = (option: DomainOption) => {
    // Select components only supports string or number values, there for we use
    // the string all-domains as a value for the all domains option.
    // The service takes null as a value for all domains.
    const domainName = option.value === ALL_DOMAINS ? null : option.value

    updateDomainName(domainName)
    refetch({
      input: {
        //domain: domainName,
      },
    })
  }

  return (
    <Box display="flex" flexDirection="column" rowGap={4} marginTop={[1, 1, 8]}>
      <DelegationsIncomingHeader
        domainName={domainName}
        onDomainChange={onDomainChange}
      />
      <div>
        {loading ? (
          <SkeletonLoader width="100%" height={191} />
        ) : error ? (
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        ) : delegations.length === 0 ? (
          <DelegationsEmptyState />
        ) : (
          <Stack space={3}>
            {delegations.map(
              (delegation) =>
                delegation.to && (
                  <AccessCard
                    key={delegation.id}
                    delegation={delegation}
                    onDelete={(delegation) => {
                      setDelegation(delegation)
                    }}
                    variant="incoming"
                  />
                ),
            )}
          </Stack>
        )}
      </div>
      <AccessDeleteModal
        id={`access-delete-modal-${delegation?.id}`}
        onClose={() => {
          setDelegation(null)
        }}
        onDelete={() => {
          setDelegation(null)
          refetch({
            input: {
              //domain: domainName,
            },
          })
        }}
        label={formatMessage(m.accessControl)}
        title={formatMessage({
          id: 'sp.settings-access-control:access-remove-modal-content',
          defaultMessage: 'Ertu viss um að þú viljir eyða þessum aðgangi?',
        })}
        isVisible={isDefined(delegation)}
        delegation={delegation as AuthCustomDelegation}
        domain={{
          name: delegation?.domain.displayName,
          imgSrc: delegation?.domain.organisationLogoUrl,
        }}
      />
    </Box>
  )
}
