import { useState } from 'react'
import * as s from './SaveDeleteButtons.css'
import { Box, Button } from '@island.is/island-ui/core'
import { buttonsMsgs, buttonsMsgs as msg } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useDraftingState } from '../state/useDraftingState'
import ConfirmModal from './ConfirmModal/ConfirmModal'

// ===========================================================================

export type SaveDeleteButtonsProps =
  | { wrap: true; classes?: undefined }
  | {
      wrap?: false
      classes: {
        deleteDraft: string
        saveDraft: string
        propose: string
      }
    }

export const SaveDeleteButtons = (props: SaveDeleteButtonsProps) => {
  const { wrap, classes = s } = props

  const t = useLocale().formatMessage
  const { saving, actions } = useDraftingState()
  const { saveStatus, deleteDraft, closeDraft, propose } = actions
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const { formatMessage } = useLocale()

  const buttons = (
    <>
      <Box className={classes.saveDraft}>
        <Button
          onClick={() => saveStatus(false, true)}
          icon="save"
          iconType="outline"
          variant="utility"
          size="small"
          disabled={saving}
        >
          {t(msg.saveAndClose)}
        </Button>
      </Box>
      {/* {propose && (
        <Box className={classes.saveDraft}>
          <Button
            onClick={() => propose()}
            icon="open"
            iconType="outline"
            variant="utility"
            size="small"
            disabled={saving}
          >
            {t(msg.propose)}
          </Button>
        </Box>
      )} */}
      <Box className={classes.deleteDraft}>
        <Button
          onClick={() => setIsConfirmationVisible(true)}
          icon="trash"
          iconType="outline"
          variant="utility"
          colorScheme="destructive"
          size="small"
        >
          {t(msg.delete)}
        </Button>
      </Box>{' '}
      <ConfirmModal
        isVisible={isConfirmationVisible}
        message={formatMessage(buttonsMsgs.confirmDelete)}
        onConfirm={deleteDraft}
        onVisibilityChange={(visibility: boolean) => {
          setIsConfirmationVisible(visibility)
        }}
      />
    </>
  )

  return wrap ? (
    <Box marginBottom={4} display="flex" flexDirection="row">
      {buttons}
    </Box>
  ) : (
    buttons
  )
}
