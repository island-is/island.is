import { useEffect, useMemo, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'

import { AuthDomain } from '@island.is/api/schema'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, useQueryParam } from '@island.is/portals/core'

import { useAuthDelegationsGroupedByIdentityOutgoingQuery } from '../../components/delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { FlowStep, FlowStepper } from '@island.is/island-ui/core'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { useDelegationForm } from '../../context'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

import { m as coreMessages } from '@island.is/portals/core'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { AccessControlLoaderResponse } from '../AccessControl.loader'
import { useIdentityLazyQuery } from '../GrantAccess/GrantAccess.generated'
import isSameDay from 'date-fns/isSameDay'

const EditAccess = () => {
  useNamespaces(['sp.access-control-delegations'])

  const { formatMessage, lang } = useLocale()
  const {
    selectedScopes,
    setSelectedScopes,
    clearForm,
    identities,
    setIdentities,
  } = useDelegationForm()
  const nationalIdParam = useQueryParam('nationalId')

  const navigate = useNavigate()
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false)

  // clear the state on unmount
  useEffect(() => {
    return () => clearForm()
  }, [clearForm])

  const needsFetch = selectedScopes.length === 0 && !!nationalIdParam

  const { data: delegationsData, loading: delegationsLoading } =
    useAuthDelegationsGroupedByIdentityOutgoingQuery({
      variables: { lang },
      skip: !needsFetch,
    })

  const [getIdentity, { data: identityData, loading: identityLoading }] =
    useIdentityLazyQuery()

  // if the state gets cleared (for example after a refresh),
  // we need to fetch users' identity info and current delegations for the initial state
  useEffect(() => {
    if (!identities.length && nationalIdParam) {
      getIdentity({
        variables: { input: { nationalId: nationalIdParam } },
      })
    }
  }, [identities.length, nationalIdParam, getIdentity])

  useEffect(() => {
    if (identityData?.identity && !identities.length) {
      setIdentities([
        {
          nationalId: identityData.identity.nationalId,
          name: identityData.identity.name,
        },
      ])
    }
  }, [identityData, identities.length, setIdentities])

  useEffect(() => {
    const allDelegations =
      delegationsData?.authDelegationsGroupedByIdentityOutgoing

    if (!nationalIdParam || selectedScopes.length > 0 || !allDelegations) {
      return
    }

    const personDelegations = allDelegations.find(
      (p) => p.nationalId === nationalIdParam,
    )

    if (personDelegations) {
      const scopes = personDelegations.scopes.map((scope) => ({
        name: scope.name,
        displayName: scope.displayName,
        description: scope.apiScope?.description,
        domain: scope.domain as AuthDomain,
        delegationId:
          ('delegationId' in scope
            ? (scope as { delegationId?: string | null }).delegationId
            : undefined) ?? undefined,
        validTo: scope.validTo ? new Date(scope.validTo) : undefined,
        validFrom: scope.validFrom ? new Date(scope.validFrom) : undefined,
        allowsWrite: scope.apiScope?.allowsWrite ?? false,
      }))
      setSelectedScopes(scopes)
    }
  }, [
    delegationsData?.authDelegationsGroupedByIdentityOutgoing,
    nationalIdParam,
    selectedScopes.length,
    setSelectedScopes,
  ])

  // if all scopes have the same validTo date, then the initial setting of the access period is the same for all scopes
  const initialIsSamePeriod = useMemo(() => {
    return (
      selectedScopes.length > 1 &&
      selectedScopes.every((scope) =>
        isSameDay(
          new Date(scope.validTo ?? ''),
          new Date(selectedScopes[0]?.validTo ?? ''),
        ),
      )
    )
  }, [selectedScopes])

  const contentfulData = useLoaderData() as AccessControlLoaderResponse

  const steps: FlowStep[] = [
    {
      id: 'select-permissions',
      name: formatMessage(m.choosePermissionsLabel),
      content: <AccessScopes />,
      continueButtonDisabled: selectedScopes.length === 0,
      continueButtonLabel: formatMessage(m.choosePeriodButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'select-period',
      name: formatMessage(m.choosePeriodLabel),
      content: <AccessPeriod initialIsSamePeriod={initialIsSamePeriod} />,
      onContinue: () => {
        setIsConfirmModalVisible(true)
      },
      continueButtonLabel: formatMessage(m.confirmAccessButtonLabel),
      continueButtonIcon: 'checkmark',
    },
  ]

  if (delegationsLoading || identityLoading) {
    return (
      <>
        <IntroHeader
          title={formatMessage(m.grantAccessStepsTitle)}
          intro={formatMessage(m.grantAccessStepsIntro)}
          marginBottom={4}
        />
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={3} />
        </Box>
      </>
    )
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.grantAccessStepsTitle)}
        intro={formatMessage(m.grantAccessStepsIntro)}
        marginBottom={4}
      />
      <div>
        <FlowStepper
          steps={steps}
          cancelButtonLabel={formatMessage(coreMessages.buttonCancel)}
          onCancel={() => {
            clearForm()
            navigate(DelegationPaths.DelegationsNew)
          }}
          backButtonLabel={formatMessage(m.backButton)}
        />

        <ConfirmAccessModal
          onClose={() => setIsConfirmModalVisible(false)}
          isVisible={isConfirmModalVisible}
        />

        {contentfulData?.faqList && (
          <Box paddingTop={8}>
            <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
          </Box>
        )}
      </div>
    </>
  )
}

export default EditAccess
