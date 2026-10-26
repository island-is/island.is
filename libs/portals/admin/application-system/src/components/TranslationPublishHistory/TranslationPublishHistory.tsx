import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  SkeletonLoader,
  Stack,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m } from '../../lib/messages'
import {
  useGetApplicationTranslationPublishHistoryQuery,
  useRollbackApplicationTranslationsMutation,
} from '../../queries/translations.generated'
import { useTranslationPublishActor } from '../../hooks/useTranslationPublishActor'

const PUBLISH_HISTORY_PAGE_SIZE = 25

const formatDateTime = (value: string) =>
  new Date(value).toLocaleDateString('is-IS', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

interface TranslationPublishHistoryProps {
  namespace: string
  isOpen: boolean
  onClose: () => void
  onRollbackComplete: () => void
  unsavedCount: number
  formatMessage: FormatMessage
}

export const TranslationPublishHistory = ({
  namespace,
  isOpen,
  onClose,
  onRollbackComplete,
  unsavedCount,
  formatMessage,
}: TranslationPublishHistoryProps) => {
  const { data, loading, refetch, fetchMore } =
    useGetApplicationTranslationPublishHistoryQuery({
      variables: { namespace, limit: PUBLISH_HISTORY_PAGE_SIZE, skip: 0 },
      skip: !isOpen || !namespace,
      fetchPolicy: 'network-only',
    })

  const [exhausted, setExhausted] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setExhausted(false)
  }, [namespace, isOpen])

  const [rollback, { loading: rollingBack }] =
    useRollbackApplicationTranslationsMutation()

  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const publishActor = useTranslationPublishActor()

  const handleRollback = useCallback(
    async (publishId: string) => {
      try {
        await rollback({
          variables: { input: { namespace, publishId, ...publishActor } },
        })
        toast.success(formatMessage(m.translationRollbackSuccess))
        setConfirmingId(null)
        await refetch()
        setExhausted(false)
        onRollbackComplete()
      } catch (err) {
        const detail = err instanceof Error ? err.message : 'Unknown error'
        toast.error(formatMessage(m.translationRollbackFailed, { detail }))
      }
    },
    [
      namespace,
      publishActor,
      rollback,
      formatMessage,
      refetch,
      onRollbackComplete,
    ],
  )

  const history = data?.applicationTranslationPublishHistory ?? []
  const hasMore =
    !exhausted &&
    history.length > 0 &&
    history.length % PUBLISH_HISTORY_PAGE_SIZE === 0

  const handleShowMore = async () => {
    setLoadingMore(true)
    try {
      const result = await fetchMore({
        variables: { skip: history.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          ...prev,
          applicationTranslationPublishHistory: [
            ...(prev.applicationTranslationPublishHistory ?? []),
            ...(fetchMoreResult?.applicationTranslationPublishHistory ?? []),
          ],
        }),
      })
      const fetched =
        result.data?.applicationTranslationPublishHistory?.length ?? 0
      if (fetched < PUBLISH_HISTORY_PAGE_SIZE) {
        setExhausted(true)
      }
    } catch (err) {
      console.error('Failed to load more publish history', err)
    } finally {
      setLoadingMore(false)
    }
  }

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
        <Text variant="h3">{formatMessage(m.translationPublishHistory)}</Text>

        {loading && history.length === 0 && (
          <SkeletonLoader
            height={64}
            repeat={3}
            space={2}
            borderRadius="large"
          />
        )}

        {!loading && history.length === 0 && (
          <Text>{formatMessage(m.translationNoPublishHistory)}</Text>
        )}

        {history.map((pub, index) => {
          const dateStr = formatDateTime(pub.publishedAt)
          const isCurrent = index === 0
          const pubId = pub.id

          return (
            <Box
              key={pubId ?? pub.publishedAt}
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
                  {pub.publishedByName && (
                    <Text variant="small" color="dark300">
                      {formatMessage(m.translationPublishedByLabel, {
                        name: pub.publishedByName,
                      })}
                    </Text>
                  )}
                  {pub.onBehalfOfName && (
                    <Text variant="small" color="dark300">
                      {formatMessage(m.translationOnBehalfOfLabel, {
                        name: pub.onBehalfOfName,
                      })}
                    </Text>
                  )}
                  {pub.rolledBackToPublishedAt && (
                    <Text variant="small" color="dark400">
                      {formatMessage(m.translationRolledBackToLabel, {
                        date: formatDateTime(pub.rolledBackToPublishedAt),
                      })}
                    </Text>
                  )}
                  {!pub.publishedByName && pub.publishedInContentfulByName && (
                    <Text variant="small" color="dark300">
                      {formatMessage(m.translationPublishedInContentfulLabel, {
                        name: pub.publishedInContentfulByName,
                      })}
                    </Text>
                  )}
                  {!pub.publishedByName &&
                    !pub.publishedInContentfulByName &&
                    pub.publishedOutsideWorkspace && (
                      <Text variant="small" color="dark300">
                        {formatMessage(
                          m.translationPublishedOutsideWorkspaceLabel,
                        )}
                      </Text>
                    )}
                  {!pub.publishedByName &&
                    !pub.publishedInContentfulByName &&
                    !pub.publishedOutsideWorkspace && (
                      <Text variant="small" color="dark300">
                        {formatMessage(m.translationPublishedByUnknownLabel)}
                      </Text>
                    )}
                </Stack>
                <Box>
                  {isCurrent ? (
                    <Tag variant="mint" outlined>
                      {formatMessage(m.translationCurrentVersion)}
                    </Tag>
                  ) : pubId ? (
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => setConfirmingId(pubId)}
                    >
                      {formatMessage(m.translationRollback)}
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Box>
          )
        })}

        {hasMore && (
          <Box display="flex" justifyContent="center">
            <Button
              size="small"
              variant="ghost"
              loading={loadingMore}
              onClick={handleShowMore}
            >
              {formatMessage(m.translationPublishHistoryShowMore)}
            </Button>
          </Box>
        )}
      </Stack>
      <Modal
        id="translation-rollback-confirm"
        isVisible={confirmingId !== null}
        label={formatMessage(m.translationRollback)}
        title={formatMessage(m.translationRollback)}
        onClose={() => setConfirmingId(null)}
        closeButtonLabel={formatMessage(m.translationPublishCancel)}
      >
        <Text>{formatMessage(m.translationRollbackConfirm)}</Text>
        {unsavedCount > 0 && (
          <Box marginTop={2}>
            <Text color="red600">
              {formatMessage(m.translationRollbackDiscardsDrafts, {
                count: unsavedCount,
              })}
            </Text>
          </Box>
        )}
        <Box
          marginTop={4}
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
        >
          <Button
            variant="ghost"
            size="small"
            onClick={() => setConfirmingId(null)}
          >
            {formatMessage(m.translationPublishCancel)}
          </Button>
          <Button
            size="small"
            colorScheme="destructive"
            loading={rollingBack}
            onClick={() => confirmingId && handleRollback(confirmingId)}
          >
            {formatMessage(m.translationRollback)}
          </Button>
        </Box>
      </Modal>
    </Drawer>
  )
}
