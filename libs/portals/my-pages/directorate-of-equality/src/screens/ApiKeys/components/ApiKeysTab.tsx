import { useRef, useState } from 'react'

import {
  AlertMessage,
  Box,
  Button,
  ProblemTemplate,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ActionCardLoader, formatDate } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { getApiKeyState } from '../../../lib/apiKeys'
import { focusAfterClose } from '../../../lib/focus'
import { messages } from '../../../lib/messages'
import {
  useDirectorateOfEqualityApiKeysQuery,
  useDirectorateOfEqualityIssueApiKeyMutation,
  useDirectorateOfEqualityRevokeApiKeyMutation,
} from '../../../mocks/hooks'
import { DirectorateOfEqualityApiKey } from '../../../mocks/types'
import { ApiKeyCard } from './ApiKeyCard'
import { ConfirmRevokeModal } from './ConfirmRevokeModal'
import { CreateApiKeyModal } from './CreateApiKeyModal'

export const ApiKeysTab = ({
  serviceProviderApprovedAt,
}: {
  serviceProviderApprovedAt: string | null
}) => {
  const { formatMessage } = useLocale()
  const isServiceProvider = !!serviceProviderApprovedAt
  const [createOpen, setCreateOpen] = useState(false)
  const [issuedKey, setIssuedKey] = useState<string | null>(null)
  const [
    revokeTarget,
    setRevokeTarget,
  ] = useState<DirectorateOfEqualityApiKey | null>(null)
  const [showInactive, setShowInactive] = useState(false)
  const createButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const {
    data,
    loading,
    error,
    refetch,
  } = useDirectorateOfEqualityApiKeysQuery()
  const items = data?.directorateOfEqualityApiKeys.items ?? []
  const active = items.filter((apiKey) => getApiKeyState(apiKey) === 'active')
  const inactive = items.filter((apiKey) => getApiKeyState(apiKey) !== 'active')
  const [
    revokeKey,
    { loading: revoking },
  ] = useDirectorateOfEqualityRevokeApiKeyMutation({
    onCompleted: (result) => {
      if (!result.directorateOfEqualityRevokeApiKey.success) {
        toast.error(formatMessage(messages.mutationError))
        return
      }
      setRevokeTarget(null)
      toast.success(formatMessage(messages.apiKeyRevoked))
      refetch()
      focusAfterClose(createButtonRef.current)
    },
    onError: () => toast.error(formatMessage(messages.mutationError)),
  })
  const [
    issueKey,
    { loading: issuing },
  ] = useDirectorateOfEqualityIssueApiKeyMutation({
    onCompleted: (result) => {
      setIssuedKey(result.directorateOfEqualityIssueApiKey.key)
      setCreateOpen(true)
      refetch()
    },
    onError: () => toast.error(formatMessage(messages.mutationError)),
  })

  const handleCreateClose = () => {
    setCreateOpen(false)
    setIssuedKey(null)
    focusAfterClose(createButtonRef.current)
  }

  return (
    <Box paddingTop={4}>
      <Text variant="h4" as="h2">
        {formatMessage(messages.companyKeysTitle)}
      </Text>
      <Text marginTop={2}>{formatMessage(messages.companyKeysIntro)}</Text>
      {serviceProviderApprovedAt && (
        <Box marginTop={4}>
          <AlertMessage
            type="info"
            title={formatMessage(messages.serviceProviderNoticeTitle)}
            message={formatMessage(messages.serviceProviderNoticeMessage, {
              date: formatDate(serviceProviderApprovedAt),
            })}
          />
        </Box>
      )}
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="center"
        marginTop={4}
      >
        <Button
          ref={createButtonRef}
          size="small"
          icon="add"
          onClick={() => setCreateOpen(true)}
        >
          {formatMessage(messages.createCompanyKey)}
        </Button>
      </Box>
      <Box marginTop={4}>
        {loading && <ActionCardLoader repeat={2} />}
        {!loading && error && <Problem error={error} noBorder={false} />}
        {!loading && !error && active.length === 0 && (
          <ProblemTemplate
            variant="info"
            tag={formatMessage(messages.serviceProviderTag)}
            title={formatMessage(
              inactive.length > 0
                ? messages.noActiveKeysTitle
                : messages.noCompanyKeysTitle,
            )}
            message={formatMessage(
              inactive.length > 0
                ? messages.noActiveKeysMessage
                : messages.noCompanyKeysMessage,
            )}
            imgSrc="./assets/images/nodata.svg"
            titleAs="h3"
          />
        )}
        {!loading && !error && active.length > 0 && (
          <Stack space={2}>
            {active.map((apiKey) => (
              <ApiKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                showType={isServiceProvider}
                onRevoke={(target, trigger) => {
                  triggerRef.current = trigger
                  setRevokeTarget(target)
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
      {inactive.length > 0 && (
        <Box marginTop={3}>
          <Button
            variant="text"
            size="small"
            icon={showInactive ? 'chevronUp' : 'chevronDown'}
            onClick={() => setShowInactive((value) => !value)}
          >
            {formatMessage(
              showInactive
                ? messages.hideInactiveKeys
                : messages.showInactiveKeys,
              { count: inactive.length },
            )}
          </Button>
        </Box>
      )}
      {inactive.length > 0 && showInactive && (
        <Box marginTop={3}>
          <Stack space={2}>
            {inactive.map((apiKey) => (
              <ApiKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                showType={isServiceProvider}
              />
            ))}
          </Stack>
        </Box>
      )}
      {createOpen && (
        <CreateApiKeyModal
          isServiceProvider={isServiceProvider}
          issuing={issuing}
          issuedKey={issuedKey}
          onSubmit={(input) => issueKey({ variables: { input } })}
          onClose={handleCreateClose}
        />
      )}
      {revokeTarget && (
        <ConfirmRevokeModal
          id="directorate-of-equality-revoke-key"
          title={formatMessage(messages.revokeKeyTitle)}
          text={formatMessage(messages.revokeKeyText, {
            title:
              revokeTarget.label ?? formatMessage(messages.keyFallbackTitle),
          })}
          confirmLabel={formatMessage(messages.revokeKey)}
          loading={revoking}
          onConfirm={() =>
            revokeKey({ variables: { input: { id: revokeTarget.id } } })
          }
          onClose={() => {
            setRevokeTarget(null)
            focusAfterClose(triggerRef.current)
          }}
        />
      )}
    </Box>
  )
}
