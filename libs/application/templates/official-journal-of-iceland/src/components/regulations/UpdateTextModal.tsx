/**
 * Asks before the amending regulation text is regenerated from its
 * impacts, since regenerating discards the user's edits to it.
 *
 * Opened from code (`isVisible`), unlike DialogPrompt which needs a
 * disclosure element, because it follows saving or deleting an impact.
 */
import { useState } from 'react'
import { Box, Button, ModalBase, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { regulation } from '../../lib/messages'
import * as s from './UpdateTextModal.css'

// ---------------------------------------------------------------------------

type UpdateTextModalProps = {
  isVisible: boolean
  /** Resolves to whether the text was saved; the modal stays open if not */
  onConfirm: () => Promise<boolean>
  onClose: () => void
}

export const UpdateTextModal = ({
  isVisible,
  onConfirm,
  onClose,
}: UpdateTextModalProps) => {
  const { formatMessage: f } = useLocale()
  const msg = regulation.content.updateText
  const [saving, setSaving] = useState(false)

  return (
    <ModalBase
      baseId="updateAmendingTextModal"
      className={s.modal}
      modalLabel={f(msg.title)}
      isVisible={isVisible}
      hideOnClickOutside={false}
      onVisibilityChange={(visible) => {
        if (!visible) onClose()
      }}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box
          position="relative"
          borderRadius="large"
          background="white"
          padding={6}
        >
          <Stack space={3}>
            <Text variant="h3" as="h2">
              {f(msg.title)}
            </Text>
            <Text>{f(msg.impactsChanged)}</Text>
            <Box display="flex" justifyContent="spaceBetween">
              <Button
                onClick={closeModal}
                size="small"
                variant="ghost"
                disabled={saving}
              >
                {f(msg.keep)}
              </Button>
              <Button
                onClick={async () => {
                  setSaving(true)
                  const saved = await onConfirm()
                  setSaving(false)
                  if (saved) closeModal()
                }}
                size="small"
                loading={saving}
              >
                {f(msg.confirm)}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </ModalBase>
  )
}
