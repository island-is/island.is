import * as s from './SaveDeleteButtons.css'
import { Box, Button } from '@island.is/island-ui/core'
import React from 'react'
import { buttonsMsgs, buttonsMsgs as msg } from '../messages'
import { useLocale } from '../utils'
import { RegDraftForm } from '../state/types'

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
  actions: {
    saveStatus: () => void
    deleteDraft: () => void
  }
} & (
  | { wrap: true; classes?: undefined }
  | {
      wrap?: false
      classes: {
        deleteDraft: string
        saveDraft: string
      }
    }
)

export const SaveDeleteButtons = (props: SaveDeleteButtonsProps) => {
  const { draft, actions, wrap, classes = s } = props
  const t = useLocale().formatMessage

  const deleteDraft = () => {
    if (
      isDraftEmpty(draft) ||
      // eslint-disable-next-line no-restricted-globals
      confirm(t(buttonsMsgs.confirmDelete))
    ) {
      actions.deleteDraft()
    }
  }

  const buttons = (
    <>
      <Box className={classes.deleteDraft}>
        <Button
          onClick={deleteDraft}
          icon="trash"
          iconType="outline"
          variant="text"
          colorScheme="destructive"
          size="small"
        >
          {t(msg.delete)}
        </Button>
      </Box>{' '}
      <Box className={classes.saveDraft}>
        <Button
          onClick={actions.saveStatus}
          icon="save"
          iconType="outline"
          variant="text"
          size="small"
        >
          {t(msg.save)}
        </Button>
      </Box>
    </>
  )

  return wrap ? (
    <Box
      marginBottom={[3, 3, 4]}
      display="flex"
      flexDirection="row"
      justifyContent="flexEnd"
    >
      {buttons}
    </Box>
  ) : (
    buttons
  )
}
