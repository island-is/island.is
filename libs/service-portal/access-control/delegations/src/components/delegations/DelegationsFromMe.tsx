import { useMemo, useState } from 'react'
import {
  SkeletonLoader,
  Stack,
  AlertBanner,
  Box,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { DelegationsHeader } from './DelegationsHeader'
import { DelegationsEmptyState } from './DelegationsEmptyState'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { AccessDeleteModal } from '../access/AccessDeleteModal'
import { AccessCard } from '../access/AccessCard'
import { isDefined } from '@island.is/shared/utils'
import { useAuthDelegationsQuery } from '@island.is/service-portal/graphql'
import { DomainOption, useDomains } from '../../hooks/useDomains'
import { ALL_DOMAINS } from '../../constants/domain'
import sortBy from 'lodash/sortBy'

export const DelegationsFromMe = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const [searchValue, setSearchValue] = useState('')
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
    null,
  )
  const { name: domainName } = useDomains()

  const { data, loading, refetch, error } = useAuthDelegationsQuery({
    variables: {
      input: {
        domain: domainName,
      },
      lang,
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

  const filteredDelegations = useMemo(() => {
    if (!searchValue) {
      return delegations
    }

    return delegations.filter((delegation) => {
      const searchValueLower = searchValue.toLowerCase()
      const name = delegation.to?.name.toLowerCase()
      const nationalId = delegation.to?.nationalId.toLowerCase()

      return (
        name?.includes(searchValueLower) || nationalId?.includes(searchValue)
      )
    })
  }, [searchValue, delegations])

  return (
    <>
      <Box display="flex" flexDirection="column" rowGap={4}>
        <DelegationsHeader
          domainName={domainName}
          onDomainChange={onDomainChange}
          onSearchChange={setSearchValue}
        />
        <div>
          {loading ? (
            <SkeletonLoader width="100%" height={191} />
          ) : error && !delegations ? (
            <AlertBanner
              description={formatMessage(m.errorFetch)}
              variant="error"
            />
          ) : delegations.length === 0 ? (
            <DelegationsEmptyState />
          ) : (
            <Stack space={3}>
              {filteredDelegations.map(
                (delegation) =>
                  delegation.to && (
                    <AccessCard
                      key={delegation.id}
                      delegation={delegation}
                      onDelete={(delegation) => {
                        setDelegation(delegation)
                      }}
                    />
                  ),
              )}
            </Stack>
          )}
        </div>
      </Box>
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
        isVisible={isDefined(delegation)}
        delegation={delegation as AuthCustomDelegation}
      />
    </>
  )
}
