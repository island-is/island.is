import { useState } from 'react'
import { ApolloError } from 'apollo-client'
import {
  SkeletonLoader,
  GridRow,
  GridColumn,
  GridContainer,
  Stack,
  AlertBanner,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { DelegationsHeader } from '../DelegationsHeader'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { AccessDeleteModal, AccessCard } from '../access'
import { isDefined } from '@island.is/shared/utils'
import type { AuthDelegationsQueryVariables } from '@island.is/service-portal/graphql'
import { DomainOption } from '../../hooks/useDomains'
import { ALL_DOMAINS } from '../../constants'

type DelegationsFromMeProps = {
  domain: {
    domainName: string | null
    setDomainName(value: string | null): void
  }

  delegations: {
    list: AuthCustomDelegation[]
    loading: boolean
    error?: ApolloError
    refetch(variables: AuthDelegationsQueryVariables): void
  }
}

export const DelegationsFromMe = ({
  domain: { domainName, setDomainName },
  delegations: {
    list: delegations,
    loading: delegationsLoading,
    error: delegationsError,
    refetch: refetchDelegations,
  },
}: DelegationsFromMeProps) => {
  const { formatMessage } = useLocale()
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
    null,
  )

  const onDomainChange = (option: DomainOption) => {
    // Select components only supports string or number values, there for we use
    // the string all-domains as a value for the all domains option.
    // The service takes null as a value for all domains.
    const domainName = option.value === ALL_DOMAINS ? null : option.value
    setDomainName(domainName)
    refetchDelegations({
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
            {delegationsLoading ? (
              <SkeletonLoader width="100%" height={191} />
            ) : delegationsError ? (
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
          refetchDelegations({
            input: {
              domain: domainName,
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
          // TODO use organisation name when available
          imgSrc: './assets/images/educationDegree.svg',
        }}
      />
    </>
  )
}
