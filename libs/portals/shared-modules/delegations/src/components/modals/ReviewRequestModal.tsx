import { useEffect, useMemo, useState } from 'react'
import add from 'date-fns/add'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  DatePicker,
  Table as T,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m as coreMessages, formatNationalId } from '@island.is/portals/core'
import {
  AuthDelegationDirection,
  AuthDelegationRequestStatus,
} from '@island.is/api/schema'

import { m } from '../../lib/messages'
import { useCreateAuthDelegationsMutation } from '../../screens/GrantAccessNew/GrantAccessNew.generated'
import {
  AuthScopeCategoriesDocument,
  AuthScopeCategoriesQuery,
  AuthScopeTagsDocument,
  AuthScopeTagsQuery,
} from '../../screens/ServiceCategories/ServiceCategories.generated'
import {
  useFulfillAuthDelegationRequestMutation,
  AuthDelegationRequestsIncomingDocument,
  AuthDelegationRequestsIncomingQuery,
} from '../delegationRequests/DelegationRequests.generated'
import * as styles from './Modals.css'

type IncomingRequest = AuthDelegationRequestsIncomingQuery['authDelegationRequestsIncoming'][number]

const defaultValidity = (request: IncomingRequest): Date => {
  const requested = request.scopes
    .map((scope) => (scope.validTo ? new Date(scope.validTo) : null))
    .filter((date): date is Date => date !== null)
  if (requested.length > 0) {
    return new Date(Math.max(...requested.map((date) => date.getTime())))
  }
  return add(new Date(), { years: 1 })
}

export const ReviewRequestModal = ({
  request,
  onClose,
  onReject,
  onCancel,
  onViewDelegation,
  readOnly = false,
  direction = 'incoming',
}: {
  request: IncomingRequest | null
  onClose: () => void
  onReject?: (request: IncomingRequest) => void
  onCancel?: (request: IncomingRequest) => void
  onViewDelegation?: (request: IncomingRequest) => void
  readOnly?: boolean
  direction?: 'incoming' | 'outgoing'
}) => {
  const { formatMessage, lang } = useLocale()
  const isOutgoing = direction === 'outgoing'
  const isGrantorReview = !readOnly && !isOutgoing

  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [validTo, setValidTo] = useState<Date | null>(null)

  useEffect(() => {
    if (request) {
      setSelected(
        Object.fromEntries(request.scopes.map((s) => [s.scopeName, true])),
      )
      setValidTo(defaultValidity(request))
    }
  }, [request])

  const [
    createAuthDelegations,
    { loading: approveLoading },
  ] = useCreateAuthDelegationsMutation()
  const [fulfillDelegationRequest] = useFulfillAuthDelegationRequestMutation({
    refetchQueries: [
      { query: AuthDelegationRequestsIncomingDocument },
      'AuthDelegationsGroupedByIdentityOutgoing',
    ],
  })

  const onApprove = async (request: IncomingRequest) => {
    const selectedScopes = request.scopes.filter(
      (scope) => selected[scope.scopeName] && scope.domainName,
    )
    if (selectedScopes.length === 0 || !validTo) {
      toast.error(formatMessage(m.requestApproveError))
      return
    }

    const scopes = selectedScopes.map((scope) => ({
      name: scope.scopeName,
      validTo,
      domainName: scope.domainName as string,
    }))

    try {
      const result = await createAuthDelegations({
        variables: {
          input: { toNationalIds: [request.to.nationalId], scopes },
        },
      })
      const createdDelegationId = result.data?.createAuthDelegations?.[0]?.id
      if (!createdDelegationId) {
        throw new Error('No delegation created')
      }
      await fulfillDelegationRequest({
        variables: {
          input: { requestId: request.id, delegationId: createdDelegationId },
        },
      })
      toast.success(formatMessage(m.requestApproveSuccess))
      onClose()
    } catch {
      toast.error(formatMessage(m.requestApproveError))
    }
  }

  const hasSelection = request?.scopes.some((s) => selected[s.scopeName])

  const {
    data: categoriesData,
    loading: categoriesLoading,
  } = useQuery<AuthScopeCategoriesQuery>(AuthScopeCategoriesDocument, {
    variables: { lang, direction: AuthDelegationDirection.outgoing },
    skip: !isGrantorReview || !request,
  })
  const { data: tagsData, loading: tagsLoading } = useQuery<AuthScopeTagsQuery>(
    AuthScopeTagsDocument,
    {
      variables: { lang, direction: AuthDelegationDirection.outgoing },
      skip: !isGrantorReview || !request,
    },
  )

  const grantableScopeNames = useMemo(() => {
    const names = new Set<string>()
    for (const category of categoriesData?.authScopeCategories ?? []) {
      for (const scope of category.scopes) {
        names.add(scope.name)
      }
    }
    for (const tag of tagsData?.authScopeTags ?? []) {
      for (const scope of tag.scopes) {
        names.add(scope.name)
      }
    }
    return names
  }, [categoriesData, tagsData])

  const catalogLoading = categoriesLoading || tagsLoading
  const ungrantableScopes =
    request && isGrantorReview && !catalogLoading
      ? request.scopes.filter((s) => !grantableScopeNames.has(s.scopeName))
      : []
  const cannotGrant = ungrantableScopes.length > 0

  const title = isOutgoing ? m.requestSentTitle : m.requestReviewTitle

  return (
    <Modal
      id="review-request-modal"
      label={formatMessage(title)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={request !== null}
      eyebrow={formatMessage(coreMessages.digitalDelegations)}
    >
      {request && (
        <>
          <Box
            display="flex"
            flexDirection="column"
            rowGap={[3, 3, 4]}
            marginTop={2}
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="flexStart"
              columnGap={2}
            >
              <Text variant="h2" as="h2">
                {formatMessage(title)}
              </Text>
              {request.createdAt && (
                <Box flexShrink={0}>
                  <Tag variant="blue" outlined disabled>
                    {formatMessage(
                      isOutgoing ? m.requestSentBadge : m.requestReceivedBadge,
                      {
                        date: format(
                          new Date(request.createdAt),
                          'd. MMMM yyyy',
                          { locale: is },
                        ),
                      },
                    )}
                  </Tag>
                </Box>
              )}
            </Box>

            {!readOnly && (
              <Text variant="default">
                {formatMessage(m.requestReviewIntro)}
              </Text>
            )}

            <Box display="flex" flexDirection="column" rowGap={2}>
              <Text variant="h5">
                {formatMessage(
                  isOutgoing
                    ? m.requestAskingSectionTitle
                    : m.requestRequesterSectionTitle,
                )}
              </Text>
              <Box
                alignSelf="flexStart"
                borderColor="blue200"
                borderWidth="standard"
                borderRadius="large"
                paddingX={[3, 4]}
                paddingY={3}
                display="flex"
                flexDirection="column"
                rowGap={1}
              >
                <Text variant="h5" as="h3">
                  {(isOutgoing ? request.from : request.to).name}
                </Text>
                <Text variant="default" color="dark400">
                  {`kt. ${formatNationalId(
                    (isOutgoing ? request.from : request.to).nationalId,
                  )}`}
                </Text>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" rowGap={[1, 1, 2]}>
              <Text variant="h5">
                {formatMessage(m.requestScopesSectionTitle)}
              </Text>
              <div className={styles.reviewScopesTable}>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      {!readOnly && (
                        <T.HeadData>
                          <Text variant="medium" fontWeight="semiBold">
                            {formatMessage(m.reviewScopeSelect)}
                          </Text>
                        </T.HeadData>
                      )}
                      <T.HeadData>
                        <Text variant="medium" fontWeight="semiBold">
                          {formatMessage(m.headerScopeName)}
                        </Text>
                      </T.HeadData>
                      <T.HeadData>
                        <Text variant="medium" fontWeight="semiBold">
                          {formatMessage(m.reviewScopeDescription)}
                        </Text>
                      </T.HeadData>
                      <T.HeadData>
                        <Text variant="medium" fontWeight="semiBold">
                          {formatMessage(m.reviewScopeType)}
                        </Text>
                      </T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {request.scopes.map((scope) => (
                      <T.Row key={scope.scopeName}>
                        {!readOnly && (
                          <T.Data>
                            <Checkbox
                              name={`select-${scope.scopeName}`}
                              checked={!!selected[scope.scopeName]}
                              onChange={() =>
                                setSelected((prev) => ({
                                  ...prev,
                                  [scope.scopeName]: !prev[scope.scopeName],
                                }))
                              }
                            />
                          </T.Data>
                        )}
                        <T.Data>
                          <Box display="flex" flexDirection="column">
                            <Box
                              display="flex"
                              alignItems="center"
                              columnGap={1}
                            >
                              {scope.organisationLogoUrl && (
                                <img
                                  src={scope.organisationLogoUrl}
                                  alt=""
                                  width={16}
                                  height={16}
                                />
                              )}
                              <Text variant="small" color="dark400">
                                {scope.domainDisplayName}
                              </Text>
                            </Box>
                            <Text variant="medium">
                              {scope.displayName ?? scope.scopeName}
                            </Text>
                          </Box>
                        </T.Data>
                        <T.Data>
                          <Text variant="small" color="dark400">
                            {scope.description}
                          </Text>
                        </T.Data>
                        <T.Data>
                          <Text variant="medium">
                            {formatMessage(
                              scope.allowsWrite
                                ? m.accessTypeReadWrite
                                : m.accessTypeRead,
                            )}
                          </Text>
                        </T.Data>
                      </T.Row>
                    ))}
                  </T.Body>
                </T.Table>
              </div>
            </Box>

            <Box display="flex" flexDirection="column" rowGap={1}>
              <Text variant="h5">
                {formatMessage(m.requestExplanationTitle)}
              </Text>
              <div className={styles.reviewReasonBox}>
                <Text variant="default">{request.reason}</Text>
              </div>
            </Box>

            <Box display="flex" flexDirection="column" rowGap={1} width="half">
              <Text variant="h5">{formatMessage(m.validityPeriod)}</Text>
              {readOnly ? (
                <div className={styles.reviewReasonBox}>
                  <Text variant="default">
                    {validTo ? format(validTo, 'dd.MM.yyyy') : '-'}
                  </Text>
                </div>
              ) : (
                <DatePicker
                  name="review-valid-to"
                  locale="is"
                  minDate={new Date()}
                  placeholderText={formatMessage(m.validityPeriod)}
                  selected={validTo ?? undefined}
                  handleChange={(date) => setValidTo(date)}
                  size="sm"
                  backgroundColor="blue"
                  required
                />
              )}
            </Box>
          </Box>

          {cannotGrant && (
            <Box marginTop={3}>
              <AlertMessage
                type="warning"
                title={formatMessage(m.requestCannotGrantTitle)}
                message={formatMessage(m.requestCannotGrantMessage, {
                  scopes: ungrantableScopes
                    .map((s) => s.displayName ?? s.scopeName)
                    .join(', '),
                })}
              />
            </Box>
          )}

          <Box position="sticky" bottom={0} background="white" paddingTop={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              width="full"
              paddingBottom={[3, 3, 4]}
            >
              <Button size="small" variant="ghost" onClick={onClose}>
                {formatMessage(coreMessages.buttonCancel)}
              </Button>
              {readOnly ? (
                <>
                  {request.status === AuthDelegationRequestStatus.pending &&
                    onCancel && (
                      <Button
                        size="small"
                        variant="primary"
                        colorScheme="destructive"
                        onClick={() => onCancel(request)}
                      >
                        {formatMessage(m.requestCancelBeidniButton)}
                      </Button>
                    )}
                  {request.status === AuthDelegationRequestStatus.approved &&
                    request.resolvedDelegationId &&
                    onViewDelegation && (
                      <Button
                        size="small"
                        variant="primary"
                        icon="arrowForward"
                        onClick={() => onViewDelegation(request)}
                      >
                        {formatMessage(m.requestViewDelegation)}
                      </Button>
                    )}
                </>
              ) : (
                <Box display="flex" columnGap={2}>
                  <Button
                    size="small"
                    variant="primary"
                    colorScheme="destructive"
                    onClick={() => onReject?.(request)}
                  >
                    {formatMessage(m.requestRejectReviewButton)}
                  </Button>
                  <Button
                    size="small"
                    variant="primary"
                    icon="checkmark"
                    loading={approveLoading}
                    disabled={!hasSelection || !validTo || cannotGrant}
                    onClick={() => onApprove(request)}
                  >
                    {formatMessage(m.requestConfirmReviewButton)}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Modal>
  )
}
