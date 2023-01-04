import { useEffect, useMemo, useState } from 'react'
import sortBy from 'lodash/sortBy'
import {
  SkeletonLoader,
  Stack,
  AlertBanner,
  Box,
} from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import {
  AuthCustomDelegation,
  AuthDelegationDirection,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/core'
import { AccessCard } from '../../access/AccessCard'
import { AccessDeleteModal } from '../../access/AccessDeleteModal/AccessDeleteModal'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { DelegationsOutgoingHeader } from './DelegationsOutgoingHeader'
import { DomainOption, useDomains } from '../../../hooks/useDomains/useDomains'
import { ALL_DOMAINS } from '../../../constants/domain'
import { useAuthDelegationsOutgoingQuery } from './DelegationsOutgoing.generated'
import { AuthCustomDelegationOutgoing } from '../../../types/customDelegation'

const prepareDomainName = (domainName: string | null) =>
  domainName === ALL_DOMAINS ? null : domainName

export const DelegationsOutgoing = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const [searchValue, setSearchValue] = useState('')

  const [
    delegation,
    setDelegation,
  ] = useState<AuthCustomDelegationOutgoing | null>(null)
  const { name: domainName } = useDomains()
  const [queryOptions, setQueryOptions] = useState({
    skip: !domainName || !lang,
    lang,
    domainName,
  })

  const { data, loading, refetch, error } = useAuthDelegationsOutgoingQuery({
    variables: {
      lang,
      input: {
        domain: prepareDomainName(queryOptions.domainName),
        direction: AuthDelegationDirection.outgoing,
      },
    },
    // We need to skip the query if
    // 1. the domainName or lang is not defined
    // 2. or these options have not changed.
    skip: queryOptions.skip,
    // Make sure that loading state is shown when refetching
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  useEffect(() => {
    // We want to make sure that the useAuthDelegationsOutgoingQuery is not executed multiple times.
    // There fore we keep state of the query options and only execute the query if
    // 1. domainName or lang has changed
    // 2. Component is remounted
    // 3. Query refetch is called.
    if (queryOptions.domainName !== domainName || queryOptions.lang !== lang) {
      setQueryOptions({
        skip: false,
        lang,
        domainName,
      })
    }
  }, [domainName, lang, queryOptions.domainName, queryOptions.lang])

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
        domain: prepareDomainName(option.value),
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
      <Box
        display="flex"
        flexDirection="column"
        rowGap={4}
        marginTop={[1, 1, 8]}
      >
        <DelegationsOutgoingHeader
          domainName={domainName}
          onDomainChange={onDomainChange}
          onSearchChange={setSearchValue}
        />
        <div>
          {loading || (!loading && domainName === null) ? (
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
                        setDelegation(
                          delegation as AuthCustomDelegationOutgoing,
                        )
                      }}
                      variant="outgoing"
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
              domain: prepareDomainName(domainName),
            },
          })
        }}
        isVisible={isDefined(delegation)}
        delegation={delegation as AuthCustomDelegation}
      />
    </>
  )
}
