import React, { useRef, useState } from 'react'
import { Box, Accordion, AccordionItem } from '@island.is/island-ui/core'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { StepComponent } from '../state/useDraftingState'
import { useLocale } from '../utils'
import { Appendixes, AppendixStateItem } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'
import { SignatureText } from './SignatureText'

export const EditBasics: StepComponent = (props) => {
  const { draft, actions } = props
  const { updateState } = actions

  const t = useLocale().formatMessage
  const textRef = useRef(() => draft.text.value)
  const [appendixes, setAppendixes] = useState(
    [] as readonly AppendixStateItem[],
  )

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
            // startExpanded={!draft.text.value || !!draft.text.error}
          >
            <Box marginBottom={3}>
              <EditorInput
                label={t(msg.text)}
                isImpact={false}
                draftId={draft.id}
                valueRef={textRef}
                error={t(draft.text.error)}
                onBlur={() => {
                  updateState('text', textRef.current())
                }}
              />
            </Box>
            <Box marginBottom={[4, 4, 6]}>
              <SignatureText
                draft={draft}
                onChange={(text) => {
                  updateState('signatureText', text)
                }}
              />
            </Box>
          </AccordionItem>
        </Accordion>

        <Appendixes
          appendixes={appendixes}
          onChange={(appendixCallback) =>
            setAppendixes(appendixCallback(appendixes))
          }
          defaultClosed
          draftId={draft.id}
        />
      </Box>
    </>
  )
}
