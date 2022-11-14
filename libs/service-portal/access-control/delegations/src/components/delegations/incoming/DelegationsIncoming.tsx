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
import { useAuthDelegationsIncomingQuery } from '@island.is/service-portal/graphql'
import { DomainOption, useDomains } from '../../../hooks/useDomains'
import { DelegationsIncomingHeader } from './DelegationsIncomingHeader'
import { AccessDeleteModal } from '../../access/AccessDeleteModal'
import { AccessCard } from '../../access/AccessCard'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { ALL_DOMAINS } from '../../../constants/domain'
import sortBy from 'lodash/sortBy'

export const DelegationsIncoming = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const { name: domainName } = useDomains()
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
    null,
  )

  const { data, loading, refetch, error } = useAuthDelegationsIncomingQuery({
    variables: {
      input: {
        domain: domainName,
      },
      // TODO enable when backend is ready
      //lang,
    },
    // Make sure that loading state is shown when refetching
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const delegations = useMemo(
    () =>
      sortBy(
        data?.authDelegations as AuthCustomDelegation[],
        (d) => d.to?.name,
      ) ?? [],
    [data?.authDelegations],
  )
  const onDomainChange = (option: DomainOption) => {
    // Select components only supports string or number values, there for we use
    // the const ALL_DOMAINS as a value for the all domains option.
    // The service takes null as a value for all domains.
    refetch({
      input: {
        domain: option.value === ALL_DOMAINS ? null : option.value,
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
                delegation.from && (
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
        onClose={() => {
          setDelegation(null)
        }}
        onDelete={() => {
          setDelegation(null)
          refetch({
            input: {
              domain: domainName,
            },
          })
        }}
        isVisible={!!delegation}
        delegation={delegation as AuthCustomDelegation}
      />
    </Box>
  )
}
