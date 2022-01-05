import * as s from './SaveDeleteButtons.css'
import { Box, Button } from '@island.is/island-ui/core'
import React from 'react'
import { buttonsMsgs as msg } from '../messages'
import { useLocale } from '../utils'
import { RegDraftForm } from '../state/types'
import { RegDraftActions } from '../state/useDraftingState'

const isDraftEmpty = (draft: RegDraftForm): boolean => {
  const someContent =
    draft.title.value ||
    draft.text.value ||
    draft.appendixes.some(({ text, title }) => title.value || text.value) ||
    draft.impacts.length

  return !someContent
}

// ===========================================================================

export type SaveDeleteButtonsProps = {
  draft: RegDraftForm
  saving?: boolean
  actions: Pick<RegDraftActions, 'saveStatus' | 'deleteDraft' | 'propose'>
} & (
  | { wrap: true; classes?: undefined }
  | {
      wrap?: false
      classes: {
        deleteDraft: string
        saveDraft: string
        propose: string
      }
    }
)

export const SaveDeleteButtons = (props: SaveDeleteButtonsProps) => {
  const { draft, actions, saving, wrap, classes = s } = props
  const t = useLocale().formatMessage
  const { saveStatus, deleteDraft, propose } = actions

  const handleDeleteClick = () => {
    if (
      isDraftEmpty(draft) ||
      // eslint-disable-next-line no-restricted-globals
      confirm(t(msg.confirmDelete))
    ) {
      deleteDraft()
    }
  }

  const buttons = (
    <>
      <Box className={classes.saveDraft}>
        <Button
          onClick={() => saveStatus()}
          icon="save"
          iconType="outline"
          variant="text"
          size="small"
          disabled={saving}
        >
          {t(msg.save)}
        </Button>
      </Box>
      {propose && (
        <Box className={classes.saveDraft}>
          <Button
            onClick={() => propose()}
            icon="open"
            iconType="outline"
            variant="text"
            size="small"
            disabled={saving}
          >
            {t(msg.propose)}
          </Button>
        </Box>
      )}
      <Box className={classes.deleteDraft}>
        <Button
          onClick={() => handleDeleteClick()}
          icon="trash"
          iconType="outline"
          variant="text"
          colorScheme="destructive"
          size="small"
        >
          {t(msg.delete)}
        </Button>
      </Box>{' '}
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
