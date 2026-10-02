import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { useTranslationWorkspaceLeaveGuard } from '../../hooks/useTranslationWorkspaceLeaveGuard'
import { m } from '../../lib/messages'

interface TranslationUnsavedChangesModalProps {
  isVisible: boolean
  saving: boolean
  onSave: () => void
  onDiscard: () => void
  onCancel: () => void
}

export const TranslationUnsavedChangesModal = ({
  isVisible,
  saving,
  onSave,
  onDiscard,
  onCancel,
}: TranslationUnsavedChangesModalProps) => {
  const { formatMessage } = useLocale()
  const title = formatMessage(m.translationUnsavedChangesTitle)

  return (
    <Modal
      id="translation-unsaved-changes"
      isVisible={isVisible}
      label={title}
      title={title}
      onClose={onCancel}
      closeButtonLabel={formatMessage(m.translationPublishCancel)}
      hideOnClickOutside={false}
    >
      <Text>{formatMessage(m.translationUnsavedChangesMessage)}</Text>
      <Box
        marginTop={4}
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        flexWrap="wrap"
        rowGap={2}
        columnGap={2}
      >
        <Button
          variant="ghost"
          size="small"
          onClick={onCancel}
          disabled={saving}
        >
          {formatMessage(m.translationPublishCancel)}
        </Button>
        <Box display="flex" flexDirection="row" columnGap={2} rowGap={2}>
          <Button
            variant="ghost"
            size="small"
            onClick={onDiscard}
            disabled={saving}
          >
            {formatMessage(m.translationUnsavedChangesDiscard)}
          </Button>
          <Button size="small" onClick={onSave} loading={saving}>
            {formatMessage(m.translationSaveDraft)}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

type TranslationUnsavedChangesGuardProps = {
  hasUnsavedChanges: boolean
  onSave: () => Promise<boolean>
  onDiscard: () => void
}

export const TranslationUnsavedChangesGuard = ({
  hasUnsavedChanges,
  onSave,
  onDiscard,
}: TranslationUnsavedChangesGuardProps) => {
  const {
    leaveGuardVisible,
    leaveGuardSaving,
    handleSaveAndLeave,
    handleDiscardAndLeave,
    handleCancelLeave,
  } = useTranslationWorkspaceLeaveGuard({
    hasUnsavedChanges,
    onSave,
    onDiscard,
  })

  return (
    <TranslationUnsavedChangesModal
      isVisible={leaveGuardVisible}
      saving={leaveGuardSaving}
      onSave={handleSaveAndLeave}
      onDiscard={handleDiscardAndLeave}
      onCancel={handleCancelLeave}
    />
  )
}
