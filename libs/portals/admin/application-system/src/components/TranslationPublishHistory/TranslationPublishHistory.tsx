import { useCallback, useState } from 'react'
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
  const { data, loading, refetch } =
    useGetApplicationTranslationPublishHistoryQuery({
      variables: { namespace },
      skip: !isOpen || !namespace,
      fetchPolicy: 'network-only',
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
        const detail = err instanceof Error ? err.message : 'Unknown error'
        toast.error(formatMessage(m.translationRollbackFailed, { detail }))
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
          const date = new Date(pub.publishedAt)
          const dateStr = date.toLocaleDateString('is-IS', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          const isCurrent = index === 0

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
                </Stack>
                <Box>
                  {isCurrent ? (
                    <Tag variant="mint" outlined>
                      {formatMessage(m.translationCurrentVersion)}
                    </Tag>
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
