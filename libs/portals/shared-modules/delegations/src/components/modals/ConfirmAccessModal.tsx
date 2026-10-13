import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { AlertMessage, Box, Text, toast } from '@island.is/island-ui/core'
import { m as coreMessages } from '@island.is/portals/core'
import { ScopeSelection, useDelegationForm } from '../../context'
import { ScopesTable } from '../ScopesTable/ScopesTable'
import { DelegationPaths } from '../../lib/paths'
import { useCreateAuthDelegationsMutation } from '../../screens/GrantAccessNew/GrantAccessNew.generated'
import { usePatchAuthDelegationMutation } from '../../screens/EditAccess.tsx/EditAccess.generated'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './Modals.css'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { findProblemInApolloError } from '@island.is/shared/problem'
import {
  StepUpAuthentication,
  type StepUpMethod,
  type StepUpStart,
} from '../StepUpAuthentication/StepUpAuthentication'
import { useDelegationConfirmationStepUp } from '../StepUpAuthentication/useDelegationConfirmationStepUp'

const isSameDay = (a?: Date, b?: Date) =>
  Boolean(a && b) && a?.toDateString() === b?.toDateString()

export const ConfirmAccessModal = ({
  onClose,
  onConfirm,
  isVisible,
  loading,
  removedScopes,
  initialScopes,
  isEdit = false,
}: {
  onClose: () => void
  onConfirm?: () => void
  isVisible: boolean
  loading?: boolean
  removedScopes?: ScopeSelection[]
  /** What the delegation already gives, when editing it. */
  initialScopes?: ScopeSelection[]
  isEdit?: boolean
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.lg
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { identities, selectedScopes } = useDelegationForm()

  // Only a sensitive scope that this save adds or changes needs a step-up. One
  // the delegation already has, with the same date, is left as it is — the
  // same rule the server applies.
  const hasSensitiveScopeSelected = selectedScopes.some(
    (scope) =>
      scope.requiresConfirmation &&
      !initialScopes?.some(
        (initial) =>
          initial.name === scope.name &&
          isSameDay(initial.validTo, scope.validTo),
      ),
  )

  const [createAuthDelegations, { loading: createLoading }] =
    useCreateAuthDelegationsMutation()
  const [patchAuthDelegation, { loading: patchLoading }] =
    usePatchAuthDelegationMutation()
  const [submitting, setSubmitting] = useState(false)
  const mutationLoading = submitting || createLoading || patchLoading

  // The step-up the save started for a held grant. While there is one, this
  // modal is the second act of "tvöfalt samþykki": the grantor confirms with
  // electronic ID, right here. One save holds everything it grants under one
  // confirmation group, and one step-up confirms it all.
  const [stepUp, setStepUp] = useState<{
    confirmationId: string
    start: StepUpStart
  }>()
  const confirmationId = stepUp?.confirmationId

  const { check } = useDelegationConfirmationStepUp(confirmationId)

  const handleStepUpConfirmed = () => {
    toast.success(formatMessage(m.stepUpConfirmed))
    navigate(DelegationPaths.DelegationsNew)
  }

  // Nothing held takes effect without the step-up, so closing it goes to the
  // grantor's delegations; an unfinished confirmation simply expires.
  const handleClose = () =>
    stepUp ? navigate(DelegationPaths.DelegationsNew) : onClose()

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm()
      return
    }

    const invalidScopes = selectedScopes.filter(
      (scope) => !scope.domain?.name || !scope.validTo,
    )

    if (invalidScopes.length > 0) {
      toast.error(formatMessage(coreMessages.somethingWrong))
      return
    }

    if (submitting) return
    setSubmitting(true)

    const scopes = selectedScopes.map((scope) => ({
      name: scope.name,
      validTo: scope.validTo as Date,
      domainName: scope.domain!.name,
    }))

    const deleteScopesByDelegation = new Map<string, string[]>()
    for (const scope of removedScopes ?? []) {
      if (!scope.delegationId) continue
      const names = deleteScopesByDelegation.get(scope.delegationId) ?? []
      names.push(scope.name)
      deleteScopesByDelegation.set(scope.delegationId, names)
    }

    try {
      for (const [delegationId, names] of deleteScopesByDelegation) {
        await patchAuthDelegation({
          variables: { input: { delegationId, deleteScopes: names } },
        })
      }

      const { data } = await createAuthDelegations({
        variables: {
          input: {
            toNationalIds: identities.map((identity) => identity.nationalId),
            scopes,
          },
        },
      })

      // Branch on what the server actually returned, never on our own feature
      // flag read: the two are cached independently and disagreeing with the
      // server is how you strand a half-created grant. The step-up has already
      // been started by the save; every confirmation of the group shares it.
      const [held] =
        data?.createAuthDelegations?.flatMap((delegation) =>
          delegation.__typename === 'AuthCustomDelegation'
            ? delegation.pendingConfirmations ?? []
            : [],
        ) ?? []

      if (held) {
        setStepUp({
          confirmationId: held.id,
          start: {
            ...held.authentication,
            method: held.authentication.method as StepUpMethod,
          },
        })
        return
      }

      navigate(DelegationPaths.DelegationsNew)
    } catch (error) {
      // 403: the grant can't be confirmed from this session (e.g. an ID card
      // login) or not right now. Nothing was granted.
      const status = findProblemInApolloError(error as never)?.status
      toast.error(
        formatMessage(status === 403 ? m.stepUpUnavailable : m.confirmError),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      id="confirm-access-modal"
      label={formatMessage(coreMessages.codeConfirmation)}
      // The step-up has a heading of its own.
      title={
        confirmationId
          ? undefined
          : formatMessage(
              isEdit
                ? m.confirmEditAccessModalTitle
                : m.confirmAccessModalTitle,
            )
      }
      onClose={handleClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      // The step-up needs much less room than the grant it confirms.
      size={confirmationId ? 'small' : 'default'}
      eyebrow={
        confirmationId
          ? undefined
          : formatMessage(coreMessages.digitalDelegations)
      }
    >
      {stepUp ? (
        <Box
          display="flex"
          flexDirection="column"
          rowGap={2}
          paddingBottom={[3, 3, 6]}
        >
          {/* A retry is a new save, with a new confirmation: start afresh. */}
          <StepUpAuthentication
            key={stepUp.confirmationId}
            stepUp={stepUp.start}
            check={check}
            onConfirmed={handleStepUpConfirmed}
            onRetry={handleConfirm}
            retrying={mutationLoading}
            context={formatMessage(m.stepUpContext)}
            onBack={handleClose}
          />
        </Box>
      ) : (
        <>
          <Box display="flex" flexDirection="column" rowGap={[3, 3, 4]}>
            <Box
              alignSelf={['stretch', 'stretch', 'flexStart']}
              display="flex"
              rowGap={2}
              columnGap={2}
              flexWrap={['nowrap', 'nowrap', 'wrap']}
              flexDirection={['column', 'column', 'row']}
            >
              {identities.map((identity) => {
                return (
                  <div
                    key={identity.nationalId}
                    className={styles.idCard}
                    style={{
                      flexBasis:
                        identities.length >= 3 && !isMobile
                          ? 'calc(33% - 9px)'
                          : 'auto',
                    }}
                  >
                    <Text variant="eyebrow">
                      {formatMessage(m.accessHolder)}
                      {identities.length > 1
                        ? ` ${identities.indexOf(identity) + 1}`
                        : ''}
                    </Text>
                    <Box>
                      <Text variant="h5">{identity.name}</Text>
                      <Text variant="default">{`kt. ${identity.nationalId}`}</Text>
                    </Box>
                  </div>
                )
              })}
            </Box>
            <Box display="flex" flexDirection="column" rowGap={[1, 1, 2]}>
              <Text variant="h5">
                {formatMessage(m.selectedScopesWithValidityPeriod)}:
              </Text>
              <ScopesTable
                showDate
                editableDates={false}
                removedScopes={removedScopes}
              />
            </Box>
            {hasSensitiveScopeSelected && (
              <AlertMessage
                type="warning"
                title={formatMessage(m.sensitiveScopesSelectedTitle)}
                message={formatMessage(m.confirmAccessSensitiveStepUpMessage)}
              />
            )}
          </Box>

          <Box position="sticky" bottom={0}>
            <DelegationsFormFooter
              loading={loading || mutationLoading}
              showShadow={false}
              onCancel={handleClose}
              onConfirm={handleConfirm}
              // A sensitive grant goes on to the authentication from here.
              confirmLabel={formatMessage(
                hasSensitiveScopeSelected
                  ? m.confirmAccessAuthenticateButton
                  : m.confirmAccessButton,
              )}
              confirmIcon="checkmark"
              containerPaddingBottom={[3, 3, 6]}
              divider={false}
            />
          </Box>
        </>
      )}
    </Modal>
  )
}
