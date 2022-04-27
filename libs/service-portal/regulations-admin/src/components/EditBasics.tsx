import React from 'react'
import {
  Box,
  Accordion,
  AccordionItem,
  Divider,
  Text,
} from '@island.is/island-ui/core'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { useLocale } from '@island.is/localization'
import { Appendixes } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'
import { useDraftingState } from '../state/useDraftingState'

export const EditBasics = () => {
  const t = useLocale().formatMessage
  const { draft, actions } = useDraftingState()

  const { text, appendixes } = draft
  const { updateState } = actions

  const startTextExpanded =
    !text.value || appendixes.length === 0 || !!text.error

  const regType =
    draft.type.value &&
    t(draft.type.value === 'amending' ? msg.type_amending : msg.type_base)

  return (
    <>
      <Box marginBottom={3}>
        <MagicTextarea
          label={t(msg.title)}
          name="title"
          defaultValue={draft.title.value}
          onBlur={(value) => updateState('title', value)}
          error={
            draft.title.showError && draft.title.error && t(draft.title.error)
          }
          required={!!draft.title.required}
        />
        <Box marginTop={1} marginLeft={1}>
          <Text variant="small" color="dark200">
            {regType ? `(${regType})` : ' '}
          </Text>
        </Box>
      </Box>
      <Box marginBottom={[6, 6, 8]}>
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
                error={text.showError && text.error && t(text.error)}
              />
            </Box>
            <Box>
              <Divider />
              {' '}
            </Box>
            {draft.signedDocumentUrl && (
              <Box marginBottom={[4, 4, 6]}>
                <EditorInput
                  label={t(msg.signatureText)}
                  draftId={draft.id}
                  value={draft.signatureText.value}
                  onChange={(text) => updateState('signatureText', text)}
                  readOnly
                />
              </Box>
            )}
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
