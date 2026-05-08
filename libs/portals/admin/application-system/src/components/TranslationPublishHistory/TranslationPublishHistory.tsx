import { gql, useApolloClient } from '@apollo/client'
import { format as formatNationalId } from 'kennitala'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  Stack,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  useGetApplicationTranslationPublishHistoryQuery,
  useRollbackApplicationTranslationsMutation,
} from '../../queries/translations.generated'

const IDENTITY_QUERY = gql`
  query AdminApplicationSystemIdentity($input: IdentityInput!) {
    identity(input: $input) {
      nationalId
      name
    }
  }
`

interface TranslationPublishHistoryProps {
  namespace: string
  isOpen: boolean
  onClose: () => void
  onRollbackComplete: () => void
  formatMessage: FormatMessage
}

export const TranslationPublishHistory = ({
  namespace,
  isOpen,
  onClose,
  onRollbackComplete,
  formatMessage,
}: TranslationPublishHistoryProps) => {
  const { data, loading, refetch } =
    useGetApplicationTranslationPublishHistoryQuery({
      variables: { namespace },
      skip: !isOpen || !namespace,
    })

  const [rollback, { loading: rollingBack }] =
    useRollbackApplicationTranslationsMutation()

  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const client = useApolloClient()

  const [nameByNationalId, setNameByNationalId] = useState<Record<string, string>>(
    {},
  )

  const requestedIdsRef = useRef<Set<string>>(new Set())

  const handleRollback = useCallback(
    async (publishId: string) => {
      try {
        await rollback({
          variables: { input: { namespace, publishId } },
        })
        toast.success(formatMessage(m.translationRollbackSuccess))
        setConfirmingId(null)
        await refetch()
        onRollbackComplete()
      } catch (err) {
        const detail =
          err instanceof Error ? err.message : 'Unknown error'
        toast.error(
          formatMessage(m.translationRollbackFailed, { detail }),
        )
      }
    },
    [namespace, rollback, formatMessage, refetch, onRollbackComplete],
  )

  const history = data?.applicationTranslationPublishHistory ?? []

  const idsToResolve = useMemo(() => {
    const ids = new Set<string>()
    for (const h of history) {
      if (h.publishedBy) ids.add(h.publishedBy)
      if (h.actorNationalId) ids.add(h.actorNationalId)
    }
    return Array.from(ids)
  }, [history])

  useEffect(() => {
    if (!isOpen) return
    if (idsToResolve.length === 0) return

    const normalize = (id: string) => id.replace(/\W/g, '')

    const unresolved = idsToResolve
      .map(normalize)
      .filter((id) => id.length === 10 && !requestedIdsRef.current.has(id))

    if (unresolved.length === 0) return

    for (const nationalId of unresolved) {
      requestedIdsRef.current.add(nationalId)

      client
        .query<{
          identity?: {
            name?: string | null
            nationalId?: string | null
          } | null
        }>({
          query: IDENTITY_QUERY,
          variables: { input: { nationalId } },
          fetchPolicy: 'network-only',
        })
        .then((res) => {
          const returnedNationalId =
            res.data?.identity?.nationalId?.replace(/\W/g, '') ?? nationalId
          const displayName = res.data?.identity?.name?.trim()
          if (!displayName) return

          setNameByNationalId((prev) => {
            if (prev[returnedNationalId]) return prev
            return { ...prev, [returnedNationalId]: displayName }
          })
        })
        .catch((err) => {
          console.warn(
            `[TranslationPublishHistory] Failed to resolve identity for ${nationalId}:`,
            err,
          )
        })
    }
  }, [client, idsToResolve, isOpen])

  const renderPersonLine = useCallback(
    (label: string, nationalIdRaw: string) => {
      const normalized = nationalIdRaw.replace(/\W/g, '')
      const formatted = normalized.length === 10 ? formatNationalId(normalized) : nationalIdRaw
      const name = normalized.length === 10 ? nameByNationalId[normalized] : undefined

      return (
        <Text variant="small" color="dark300">
          {name ? `${label}: ${name} (${formatted})` : `${label}: ${formatted}`}
        </Text>
      )
    },
    [nameByNationalId],
  )

  return (
    <Drawer
      baseId="translation-publish-history"
      ariaLabel={formatMessage(m.translationPublishHistory)}
      position="left"
      isVisible={isOpen}
      onVisibilityChange={(visible) => {
        if (!visible) onClose()
      }}
      hideOnClickOutside
    >
      <Stack space={3}>
        <Text variant="h3">
          {formatMessage(m.translationPublishHistory)}
        </Text>

        {loading && <Text>...</Text>}

        {!loading && history.length === 0 && (
          <Text>{formatMessage(m.translationNoPublishHistory)}</Text>
        )}

        {history.map((pub, index) => {
          const date = new Date(pub.publishedAt)
          const dateStr = date.toLocaleDateString('is-IS', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          const isCurrent = index === 0
          const isConfirming = confirmingId === pub.id

          return (
            <Box
              key={pub.id}
              border="standard"
              borderRadius="large"
              padding={3}
            >
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
              >
                <Stack space={1}>
                  <Text variant="small" fontWeight="semiBold">
                    {dateStr}
                  </Text>
                  {pub.publishedBy && (
                    renderPersonLine(
                      formatMessage(m.nationalId),
                      pub.publishedBy,
                    )
                  )}
                  {pub.actorNationalId && (
                    renderPersonLine(
                      formatMessage(m.procurer),
                      pub.actorNationalId,
                    )
                  )}
                  {pub.note && (
                    <Text variant="small" color="dark400">
                      {pub.note}
                    </Text>
                  )}
                </Stack>
                <Box>
                  {isCurrent ? (
                    <Tag variant="mint" outlined>
                      {formatMessage(m.translationCurrentVersion)}
                    </Tag>
                  ) : isConfirming ? (
                    <Stack space={1}>
                      <Text variant="small">
                        {formatMessage(m.translationRollbackConfirm)}
                      </Text>
                      <Box display="flex" columnGap={1}>
                        <Button
                          size="small"
                          colorScheme="destructive"
                          loading={rollingBack}
                          onClick={() => handleRollback(pub.id)}
                        >
                          {formatMessage(m.translationRollback)}
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => setConfirmingId(null)}
                        >
                          &times;
                        </Button>
                      </Box>
                    </Stack>
                  ) : (
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => setConfirmingId(pub.id)}
                    >
                      {formatMessage(m.translationRollback)}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )
        })}
      </Stack>
    </Drawer>
  )
}
