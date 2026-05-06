import { useCallback, useState } from 'react'
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
                    <Text variant="small" color="dark300">
                      {pub.publishedBy}
                    </Text>
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
