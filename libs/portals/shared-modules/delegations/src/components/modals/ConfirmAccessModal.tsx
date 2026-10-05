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
import { StepUpAuthentication } from '../StepUpAuthentication/StepUpAuthentication'
import { useDelegationConfirmationStepUp } from '../StepUpAuthentication/useDelegationConfirmationStepUp'

export const ConfirmAccessModal = ({
  onClose,
  onConfirm,
  isVisible,
  loading,
  removedScopes,
  isEdit = false,
}: {
  onClose: () => void
  onConfirm?: () => void
  isVisible: boolean
  loading?: boolean
  removedScopes?: ScopeSelection[]
  isEdit?: boolean
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.lg
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { identities, selectedScopes } = useDelegationForm()

  const hasSensitiveScopeSelected = selectedScopes.some(
    (scope) => scope.requiresConfirmation,
  )

  const [createAuthDelegations, { loading: createLoading }] =
    useCreateAuthDelegationsMutation()
  const [patchAuthDelegation, { loading: patchLoading }] =
    usePatchAuthDelegationMutation()
  const [submitting, setSubmitting] = useState(false)
  const mutationLoading = submitting || createLoading || patchLoading

  // Held confirmations returned by the grant. While there are any, this modal
  // is the second act of "tvöfalt samþykki": the grantor confirms each one with
  // electronic ID, right here.
  const [pendingIds, setPendingIds] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [expired, setExpired] = useState(false)
  const confirmationId = pendingIds[current]

  const { start, check } = useDelegationConfirmationStepUp(confirmationId, {
    onExpired: () => setExpired(true),
  })

  const handleStepUpConfirmed = () => {
    if (current + 1 < pendingIds.length) {
      setCurrent(current + 1)
      return
    }
    toast.success(formatMessage(m.stepUpConfirmed))
    navigate(DelegationPaths.DelegationsNew)
  }

  // The grant itself exists once the step-up has begun, so closing goes to the
  // grantor's delegations rather than back to the form. An unfinished
  // confirmation stays pending until it expires.
  const handleClose = () =>
    pendingIds.length ? navigate(DelegationPaths.DelegationsNew) : onClose()

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
      // server is how you strand a half-created grant.
      const pending = data?.createAuthDelegations?.flatMap((delegation) =>
        delegation.__typename === 'AuthCustomDelegation'
          ? delegation.pendingConfirmations ?? []
          : [],
      )

      if (pending?.length) {
        setPendingIds(pending.map((confirmation) => confirmation.id))
        return
      }

      navigate(DelegationPaths.DelegationsNew)
    } catch {
      toast.error(formatMessage(m.confirmError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      id="confirm-access-modal"
      label={formatMessage(coreMessages.codeConfirmation)}
      title={formatMessage(
        isEdit ? m.confirmEditAccessModalTitle : m.confirmAccessModalTitle,
      )}
      onClose={handleClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      eyebrow={formatMessage(coreMessages.digitalDelegations)}
    >
      {confirmationId ? (
        <Box
          display="flex"
          flexDirection="column"
          rowGap={2}
          paddingBottom={[3, 3, 6]}
        >
          {pendingIds.length > 1 && (
            <Text variant="eyebrow" textAlign="center">
              {formatMessage(m.stepUpProgress, {
                current: current + 1,
                total: pendingIds.length,
              })}
            </Text>
          )}
          {expired ? (
            <AlertMessage
              type="warning"
              title={formatMessage(m.confirmDelegationExpiredTitle)}
              message={formatMessage(m.confirmDelegationExpiredMessage)}
            />
          ) : (
            <StepUpAuthentication
              key={confirmationId}
              autoStart
              start={start}
              check={check}
              onConfirmed={handleStepUpConfirmed}
              onExpired={() => setExpired(true)}
            />
          )}
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
              confirmLabel={formatMessage(coreMessages.codeConfirmation)}
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
