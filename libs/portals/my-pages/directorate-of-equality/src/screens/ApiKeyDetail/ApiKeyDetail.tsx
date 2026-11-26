import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DirectorateOfEqualityApiKey } from '@island.is/api/schema'
import { toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { getApiKeyState } from '../../lib/apiKeys'
import { getApiKeyCardText } from '../../lib/cardText'
import { NAMESPACE } from '../../lib/constants'
import { focusAfterClose } from '../../lib/focus'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { getApiKeyTag } from '../../lib/status'
import { ConfirmRevokeModal } from '../../components/ConfirmRevokeModal/ConfirmRevokeModal'
import { DirectorateOfEqualityApiKeysDocument } from '../ApiKeys/ApiKeys.generated'
import {
  useDirectorateOfEqualityApiKeyDetailQuery,
  useDirectorateOfEqualityRevokeApiKeyMutation,
} from './ApiKeyDetail.generated'

const ApiKeyDetail = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }
  const { data, loading, error } = useDirectorateOfEqualityApiKeyDetailQuery()
  const apiKey = data?.directorateOfEqualityApiKeys?.items.find(
    (item) => item.id === id,
  )
  const [revokeTarget, setRevokeTarget] = useState<{
    apiKey: DirectorateOfEqualityApiKey
    title: string
  } | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const [revokeKey, { loading: revoking }] =
    useDirectorateOfEqualityRevokeApiKeyMutation({
      refetchQueries: [{ query: DirectorateOfEqualityApiKeysDocument }],
      awaitRefetchQueries: true,
      onCompleted: (result) => {
        if (!result.revokeDirectorateOfEqualityApiKey.success) {
          toast.error(formatMessage(messages.mutationError))
          return
        }
        toast.success(formatMessage(messages.apiKeyDeleted))
        navigate(DirectorateOfEqualityPaths.ApiKeys, { replace: true })
      },
      onError: () => toast.error(formatMessage(messages.mutationError)),
    })

  const title = apiKey?.label ?? formatMessage(messages.keyFallbackTitle)
  const state = apiKey ? getApiKeyState(apiKey) : undefined

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(coreMessages.equalityApiKey)}
      intro={revokeTarget?.title ?? title}
      loading={loading}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !loading && !apiKey && !revokeTarget ? (
        <Problem type="not_found" noBorder={false} />
      ) : (
        <InfoLineStack label={messages.information}>
          <InfoLine
            label={messages.apiKeyGrantedTo}
            content={apiKey ? title : undefined}
            loading={loading}
          />
          <InfoLine
            label={messages.apiKeyGrantedBy}
            content={
              apiKey?.createdByDirectorate
                ? formatMessage(messages.keyCreatedByDoe)
                : apiKey?.createdByName ?? '–'
            }
            loading={loading}
          />
          <InfoLine
            label={coreMessages.status}
            content={state ? getApiKeyTag(state, formatMessage).label : undefined}
            loading={loading}
            button={
              state === 'active'
                ? {
                    type: 'action',
                    variant: 'text',
                    icon: 'trash',
                    label: messages.deleteApiKey,
                    action: () => {
                      if (!apiKey) return
                      triggerRef.current =
                        document.activeElement as HTMLElement
                      setRevokeTarget({ apiKey, title })
                    },
                  }
                : undefined
            }
          />
          <InfoLine
            label={messages.apiKeyValidity}
            content={
              apiKey
                ? `${formatDate(apiKey.createdAt)} – ${
                    apiKey.expiresAt
                      ? formatDate(apiKey.expiresAt)
                      : formatMessage(messages.keyNoExpiry)
                  }`
                : undefined
            }
            loading={loading}
          />
          <InfoLine
            label={messages.apiKeyLastUsedAt}
            content={
              apiKey?.lastUsedAt
                ? formatDate(apiKey.lastUsedAt)
                : formatMessage(messages.keyNeverUsed)
            }
            loading={loading}
          />
        </InfoLineStack>
      )}
      {revokeTarget && (
        <ConfirmRevokeModal
          id="directorate-of-equality-revoke-key"
          title={formatMessage(messages.deleteKeyConfirmTitle)}
          text={formatMessage(messages.deleteKeyConfirmText)}
          summary={{
            heading: revokeTarget.title,
            ...getApiKeyCardText(revokeTarget.apiKey, formatMessage),
          }}
          confirmLabel={formatMessage(messages.deleteKey)}
          loading={revoking}
          onConfirm={() =>
            revokeKey({
              variables: {
                input: {
                  id: revokeTarget.apiKey.id,
                  type: revokeTarget.apiKey.type,
                },
              },
            })
          }
          onClose={() => {
            setRevokeTarget(null)
            focusAfterClose(triggerRef.current)
          }}
        />
      )}
    </IntroWrapper>
  )
}

export default ApiKeyDetail
