import { useState } from 'react'
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
import { useNamespaces, useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { AccessDeleteModal, AccessCard } from '../access'
import { isDefined } from '@island.is/shared/utils'
import type { AuthDelegationsQueryVariables } from '@island.is/service-portal/graphql'

type DelegationsFromMeProps = {
  domainName: string | null
  setDomainName(value: string | null): void
  refetchDelegations(variables: AuthDelegationsQueryVariables): void
  delegations: AuthCustomDelegation[]
  delegationsLoading: boolean
}

export const DelegationsFromMe = ({
  domainName,
  setDomainName,
  delegations,
  delegationsLoading,
  refetchDelegations,
}: DelegationsFromMeProps) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const [delegation, setDelegation] = useState<AuthCustomDelegation | null>(
    null,
  )

  const onDomainChange = (option: DomainOption) => {
    const domainName = option.value
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
          name: 'Landsbankaappið',
          imgSrc: './assets/images/educationDegree.svg',
        }}
      />
    </>
  )
}
