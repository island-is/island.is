import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthDomain } from '@island.is/api/schema'
import { Box, SkeletonLoader, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  useGetServicePortalPageQuery,
  useQueryParam,
} from '@island.is/portals/core'

import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'
import { useAuthDelegationsGroupedByIdentityOutgoingQuery } from '../../components/delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { FlowStep, FlowStepper } from '@island.is/island-ui/core'
import { AccessPeriod } from '../../components/GrantAccessSteps/AccessPeriod'
import { AccessScopes } from '../../components/GrantAccessSteps/AccessScopes'
import { DeleteWarningStep } from '../../components/GrantAccessSteps/DeleteWarningStep'
import { ScopeSelection, useDelegationForm } from '../../context'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

import { m as coreMessages } from '@island.is/portals/core'
import { ConfirmAccessModal } from '../../components/modals/ConfirmAccessModal'
import { DeleteAccessModal } from '../../components/modals/DeleteAccessModal'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { useIdentityLazyQuery } from '../GrantAccess/GrantAccess.generated'
import isSameDay from 'date-fns/isSameDay'
import { useDeleteDelegationsByPerson } from '../../hooks/useDeleteDelegationsByPerson'

const EditAccess = () => {
  useNamespaces(['sp.access-control-delegations'])

  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false)
  const [initialScopes, setInitialScopes] = useState<ScopeSelection[]>([])
  const [personType, setPersonType] = useState<string | null | undefined>(
    undefined,
  )
  const hasHydratedRef = useRef(false)

  // clear the state on unmount
  useEffect(() => {
    return () => clearForm()
  }, [clearForm])

  const needsFetch = !hasHydratedRef.current && !!nationalIdParam

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

    if (!nationalIdParam || !allDelegations) {
      return
    }

    const personDelegations = allDelegations.find(
      (p) => p.nationalId === nationalIdParam,
    )

    if (!personDelegations) return

    setPersonType((current) =>
      current === undefined ? personDelegations.type : current,
    )

    if (hasHydratedRef.current) return

    const scopes: ScopeSelection[] = personDelegations.scopes.map((scope) => ({
      name: scope.name,
      displayName: scope.displayName,
      description: scope.apiScope?.description ?? undefined,
      domain: scope.domain as AuthDomain,
      delegationId:
        ('delegationId' in scope
          ? (scope as { delegationId?: string | null }).delegationId
          : undefined) ?? undefined,
      validTo: scope.validTo ? new Date(scope.validTo) : undefined,
      validFrom: scope.validFrom ? new Date(scope.validFrom) : undefined,
      allowsWrite: scope.apiScope?.allowsWrite ?? false,
    })) as ScopeSelection[]
    setSelectedScopes(scopes)
    setInitialScopes(scopes)
    hasHydratedRef.current = true
  }, [
    delegationsData?.authDelegationsGroupedByIdentityOutgoing,
    nationalIdParam,
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

  const removedScopes = useMemo(
    () =>
      initialScopes.filter(
        (s) => !selectedScopes.some((sel) => sel.name === s.name),
      ),
    [initialScopes, selectedScopes],
  )

  const { data: contentfulQueryData } = useGetServicePortalPageQuery({
    variables: { input: { slug: 'umbod/breyta', lang } },
  })
  const contentfulData = contentfulQueryData?.getServicePortalPage
  const faqList =
    (isCompany(userInfo) && contentfulData?.faqListCompany) ||
    contentfulData?.faqList

  const recipient = identities[0]
  const { deleteByPerson, loading: deleting } = useDeleteDelegationsByPerson({
    direction: 'outgoing',
  })

  const onConfirmDelete = async () => {
    if (!recipient?.nationalId) return
    const didDelete = await deleteByPerson({
      nationalId: recipient.nationalId,
      type: personType,
      scopes: initialScopes.map((s) => ({ delegationId: s.delegationId })),
    })
    if (!didDelete) return
    setIsDeleteModalVisible(false)
    toast.success(formatMessage(m.deleteSuccess))
    clearForm()
    navigate(DelegationPaths.DelegationsNew)
  }

  const isAllUnchecked = hasHydratedRef.current && selectedScopes.length === 0

  const steps: FlowStep[] = [
    {
      id: 'select-permissions',
      name: formatMessage(m.choosePermissionsLabel),
      content: <AccessScopes />,
      continueButtonLabel: isAllUnchecked
        ? formatMessage(m.continueStepLabel)
        : formatMessage(m.choosePeriodButtonLabel),
      continueButtonIcon: 'arrowForward',
    },
    isAllUnchecked
      ? {
          id: 'delete-warning',
          name: formatMessage(m.deleteWarningStepLabel),
          content: <DeleteWarningStep initialScopes={initialScopes} />,
          onContinue: () => {
            setIsDeleteModalVisible(true)
          },
          continueButtonLabel: formatMessage(m.deleteWarningButton),
          continueButtonIcon: 'trash',
          continueButtonColorScheme: 'destructive',
        }
      : {
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
          title={formatMessage(m.editAccessStepsTitle)}
          intro={formatMessage(m.editAccessStepsIntro)}
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
        title={formatMessage(m.editAccessStepsTitle)}
        intro={formatMessage(m.editAccessStepsIntro)}
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
          isEdit={true}
          onClose={() => setIsConfirmModalVisible(false)}
          isVisible={isConfirmModalVisible}
          removedScopes={removedScopes}
        />

        {recipient && (
          <DeleteAccessModal
            isVisible={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            onDelete={onConfirmDelete}
            loading={deleting}
            direction="outgoing"
            otherIdentity={{
              name: recipient.name,
              nationalId: recipient.nationalId,
            }}
            scopes={initialScopes}
          />
        )}

        {faqList && faqList.questions.length > 0 && (
          <Box paddingTop={8}>
            <FaqList {...(faqList as unknown as FaqListProps)} />
          </Box>
        )}
      </div>
    </>
  )
}

export default EditAccess
