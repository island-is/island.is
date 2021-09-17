import React, { useRef, useState } from 'react'
import { HTMLText } from '@hugsmidjan/regulations-editor/types'
import { Box, Button } from '@island.is/island-ui/core'
import { RegDraftForm } from '../state/types'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { useLocale } from '../utils'

export type DraftingNotesProps = {
  draft: RegDraftForm
  actions: { updateDraftingNotes: (notes: HTMLText) => void }
}

export const DraftingNotes = (props: DraftingNotesProps) => {
  const { draft, actions } = props

  const t = useLocale().formatMessage
  const notesRef = useRef(() => draft.draftingNotes.value)

  const [showDraftingNotes, setShowDraftingNotes] = useState(
    !!draft.draftingNotes.value,
  )

  return (
    <Box marginTop={[6, 6, 8]}>
      {showDraftingNotes && (
        <EditorInput
          label={t(msg.draftingNotes)}
          isImpact={false}
          draftId={`${draft.id}-notes`}
          valueRef={notesRef}
          onBlur={() =>
            actions.updateDraftingNotes(
              notesRef
                .current()
                // Replace empty HTML with empty string ('')
                // TODO: See if this should rather happen in the reducer/action
                .replace(/(<(?!\/)[^>]+>)+(<\/[^>]+>)+/, '') as HTMLText,
            )
          }
        />
      )}
      {!showDraftingNotes ? (
        <Button
          variant="text"
          preTextIcon="add"
          // size="large"
          onClick={() => setShowDraftingNotes(true)}
        >
          {t(msg.draftingNotes)}
        </Button>
      ) : (
        !draft.draftingNotes.value && (
          <Button
            variant="text"
            preTextIcon="remove"
            size="small"
            onClick={() => setShowDraftingNotes(false)}
          >
            {t(msg.draftingNotes_hide)}
          </Button>
        )
      )}
    </Box>
  )
}
