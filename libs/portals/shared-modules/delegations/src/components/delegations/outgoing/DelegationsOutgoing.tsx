import { useMemo, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { SkeletonLoader, Stack, Box } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'
import {
  AuthCustomDelegation,
  AuthDelegationDirection,
  AuthDelegationType,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { AccessCard } from '../../access/AccessCard'
import { AccessDeleteModal } from '../../access/AccessDeleteModal/AccessDeleteModal'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { DelegationsOutgoingHeader } from './DelegationsOutgoingHeader'
import { DomainOption, useDomains } from '../../../hooks/useDomains/useDomains'
import { useAuthDelegationsOutgoingQuery } from './DelegationsOutgoing.generated'
import {
  AuthCustomDelegationIncoming,
  AuthCustomDelegationOutgoing,
} from '../../../types/customDelegation'
import { ALL_DOMAINS } from '../../../constants/domain'
import { m } from '../../../lib/messages'
import { DelegationPaths } from '../../../lib/paths'
import { useNavigate } from 'react-router-dom'
import { DelegationViewModal } from '../DelegationViewModal'

export const prepareDomainName = (domainName: string | null) =>
  domainName === ALL_DOMAINS ? null : domainName

export const DelegationsOutgoing = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const [searchValue, setSearchValue] = useState('')
  const [delegation, setDelegation] =
    useState<AuthCustomDelegationOutgoing | null>(null)
  const [delegationView, setDelegationView] =
    useState<AuthCustomDelegationIncoming | null>(null)
  const { name: domainName } = useDomains()
  const navigate = useNavigate()

  const { data, loading, refetch, error } = useAuthDelegationsOutgoingQuery({
    variables: {
      lang,
      input: {
        domain: prepareDomainName(domainName),
        direction: AuthDelegationDirection.outgoing,
      },
    },
    skip: !domainName || !lang,
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
    // Select components only supports string or number values, therefore we use
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
          {(loading || domainName === null) && !error ? (
            <SkeletonLoader width="100%" height={191} />
          ) : error && (!delegations || delegations.length === 0) ? (
            <Problem error={error} />
          ) : delegations.length === 0 ? (
            <DelegationsEmptyState
              message={formatMessage(m.noOutgoingDelegations)}
              imageAlt={formatMessage(m.noDelegationsImageAlt)}
            />
          ) : (
            <Stack space={3}>
              {filteredDelegations.map((delegation) => {
                if (delegation.type === AuthDelegationType.LegalGuardianMinor)
                  return null

                const isGeneralMandate =
                  delegation.type === AuthDelegationType.GeneralMandate

                return (
                  delegation.to && (
                    <AccessCard
                      key={delegation.id}
                      delegation={delegation}
                      onDelete={(delegation) => {
                        setDelegation(
                          delegation as AuthCustomDelegationOutgoing,
                        )
                      }}
                      onEdit={
                        !isGeneralMandate
                          ? (delegation) =>
                              navigate(
                                `${DelegationPaths.Delegations}/${delegation.id}`,
                              )
                          : undefined
                      }
                      onRenew={
                        !isGeneralMandate
                          ? (delegation) =>
                              navigate(
                                `${DelegationPaths.Delegations}/${delegation.id}`,
                              )
                          : undefined
                      }
                      onView={
                        isGeneralMandate
                          ? (delegation) => {
                              setDelegationView(
                                delegation as AuthCustomDelegationIncoming,
                              )
                            }
                          : undefined
                      }
                      variant="outgoing"
                    />
                  )
                )
              })}
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
      <DelegationViewModal
        onClose={() => setDelegationView(null)}
        isVisible={!!delegationView}
        delegation={delegationView ?? undefined}
        direction={'outgoing'}
      />
    </>
  )
}
