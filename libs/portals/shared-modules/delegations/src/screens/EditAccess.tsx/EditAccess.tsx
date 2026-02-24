import { useEffect, useState } from 'react'
import { defineMessage } from 'react-intl'
import { useLoaderData, useNavigate } from 'react-router-dom'

import { AuthDomain } from '@island.is/api/schema'
import { Box, SkeletonLoader, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, useQueryParam } from '@island.is/portals/core'

import { useAuthDelegationsGroupedByIdentityOutgoingQuery } from '../../components/delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { FlowStep, FlowStepper } from '../../components/FlowStepper'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { useDelegationForm } from '../../context'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

import { m as coreMessages } from '@island.is/portals/core'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'
import { useCreateAuthDelegationsMutation } from '../GrantAccessNew/GrantAccessNew.generated'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { AccessControlLoaderResponse } from '../AccessControl.loader'

const EditAccess = () => {
  useNamespaces(['sp.access-control-delegations'])

  const { formatMessage, lang } = useLocale()
  const { selectedScopes, setSelectedScopes, clearForm } = useDelegationForm()
  const nationalIdParam = useQueryParam('nationalId')

  const navigate = useNavigate()
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false)

  // clear the state on unmount
  useEffect(() => {
    return () => clearForm()
  }, [clearForm])

  const needsFetch = selectedScopes.length === 0 && !!nationalIdParam

  const { data: outgoingData, loading: outgoingLoading } =
    useAuthDelegationsGroupedByIdentityOutgoingQuery({
      variables: { lang },
      skip: !needsFetch,
    })

  const delegationsLoading = outgoingLoading

  useEffect(() => {
    if (!nationalIdParam || selectedScopes.length > 0) {
      return
    }

    const allDelegations =
      outgoingData?.authDelegationsGroupedByIdentityOutgoing

    if (!allDelegations) {
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
      }))
      setSelectedScopes(scopes)
    }
  }, [
    outgoingData,
    nationalIdParam,
    selectedScopes.length,
    setSelectedScopes,
    navigate,
  ])

  const initialIsSamePeriod =
    selectedScopes.length > 1 &&
    selectedScopes.every(
      (scope) => scope.validTo === selectedScopes[0]?.validTo,
    )

  const [createAuthDelegations, { loading: mutationLoading }] =
    useCreateAuthDelegationsMutation()

  const contentfulData = useLoaderData() as AccessControlLoaderResponse

  const steps: FlowStep[] = [
    {
      id: 'select-permissions',
      name: formatMessage(m.StepTwoLabel),
      content: <AccessScopes />,
      continueButtonDisabled: selectedScopes.length === 0,
      continueButtonLabel: formatMessage(m.stepTwoContinueButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    {
      id: 'select-period',
      name: formatMessage(m.stepThreeLabel),
      content: <AccessPeriod initialIsSamePeriod={initialIsSamePeriod} />,
      onContinue: () => {
        setIsConfirmModalVisible(true)
      },
      continueButtonLabel: formatMessage(m.stepThreeContinueButtonLabel),
      continueButtonIcon: 'checkmark',
    },
  ]

  if (delegationsLoading) {
    return (
      <>
        <IntroHeader
          title={formatMessage(m.grantAccessStepsTitle)}
          intro={defineMessage(m.grantAccessStepsIntro)}
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
        intro={defineMessage(m.grantAccessStepsIntro)}
        marginBottom={4}
      />
      <div>
        <FlowStepper
          steps={steps}
          cancelButtonLabel={formatMessage(coreMessages.buttonCancel)}
          onCancel={() => {
            navigate(DelegationPaths.DelegationsNew)
          }}
        />

        <ConfirmAccessModal
          onClose={() => setIsConfirmModalVisible(false)}
          onConfirm={() => {
            const scopes = selectedScopes
              .map((scope) => {
                if (!scope.domain?.name || !scope.validTo) {
                  return null
                }
                return {
                  name: scope.name,
                  validTo: scope.validTo,
                  domainName: scope.domain.name,
                }
              })
              .filter((scope) => scope !== null)
            if (!nationalIdParam) {
              return
            }
            createAuthDelegations({
              variables: {
                input: {
                  toNationalIds: [nationalIdParam],
                  scopes,
                },
              },
            })
              .then(() => {
                navigate(DelegationPaths.DelegationsNew)
              })
              .catch(() => {
                toast.error(formatMessage(coreMessages.somethingWrong))
              })
          }}
          loading={mutationLoading}
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
