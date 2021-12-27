import React from 'react'
import { Box, Accordion, AccordionItem } from '@island.is/island-ui/core'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { StepComponent } from '../state/useDraftingState'
import { useLocale } from '../utils'
import { Appendixes } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'

export const EditBasics: StepComponent = (props) => {
  const { draft, actions } = props
  const { updateState } = actions
  const { text, appendixes } = draft

  const t = useLocale().formatMessage

  const startTextExpanded =
    !text.value || appendixes.length === 0 || !!text.error

  return (
    <>
      <Box marginBottom={3}>
        <MagicTextarea
          label={t(msg.title)}
          name="title"
          value={draft.title.value}
          onChange={(value) => {
            updateState('title', value)
          }}
          error={t(draft.title.error)}
          required
        />
      </Box>

      <Box marginTop={6} marginBottom={[6, 6, 8]}>
        <Accordion>
          <AccordionItem
            id={draft.id}
            label={t(msg.text)}
            startExpanded={startTextExpanded}
          >
            <Box marginBottom={3}>
              <EditorInput
                label={t(msg.text)}
                hiddenLabel
                draftId={draft.id}
                value={text.value}
                onChange={(value) => updateState('text', value)}
                error={t(text.error)}
              />
            </Box>
            <Box marginBottom={[4, 4, 6]}>
              <EditorInput
                label={t(msg.signatureText)}
                draftId={draft.id}
                value={draft.signatureText.value}
                onChange={(text) => updateState('signatureText', text)}
              />
            </Box>
          </AccordionItem>
        </Accordion>

        <Appendixes
          draftId={draft.id}
          appendixes={appendixes}
          actions={actions}
        />
      </Box>
    </>
  )
}
