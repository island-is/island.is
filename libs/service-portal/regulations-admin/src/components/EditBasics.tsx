import React, { useRef, useState } from 'react'
import {
  Box,
  Button,
  DatePicker,
  Checkbox,
  Accordion,
  AccordionItem,
  Inline,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { HTMLText } from '@island.is/regulations'
import { StepComponent } from '../state/useDraftingState'
import { getMinPublishDate } from '../utils'
import { Appendixes, AppendixStateItem } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'

export const EditBasics: StepComponent = (props) => {
  const t = useIntl().formatMessage
  const { draft, actions } = props
  const { updateState } = actions

  const [appendixes, setAppendixes] = useState(
    [] as readonly AppendixStateItem[],
  )

  const textRef = useRef(() => draft.text.value)
  const notesRef = useRef(() => draft.draftingNotes.value)

  const [showDraftingNotes, setShowDraftingNotes] = useState(
    !!draft.draftingNotes.value,
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
          errorMessage={t(msg.requiredFieldError)}
          hasError={!!draft.title?.error}
        />
      </Box>

      <Box>
        <Inline space="gutter" alignY="center">
          <DatePicker
            size="sm"
            label={t(msg.idealPublishDate)}
            placeholderText={t(msg.idealPublishDate_default)}
            minDate={getMinPublishDate(draft.fastTrack.value)}
            selected={draft.idealPublishDate.value}
            handleChange={(date: Date) => updateState('idealPublishDate', date)}
            hasError={!!draft.idealPublishDate.error}
            errorMessage={t(msg.requiredFieldError)}
            // excludeDates={[]} --> Do we want to exclude holidays and weekends from the calendar?
          />
          <Checkbox
            label={t(msg.applyForFastTrack)}
            labelVariant="default"
            checked={draft.fastTrack.value}
            onChange={() => {
              updateState('fastTrack', !draft.fastTrack.value)
            }}
          />
        </Inline>
      </Box>
      <Box marginBottom={6}>
        {!!draft.idealPublishDate.value && (
          <Button
            size="small"
            variant="text"
            preTextIcon="close"
            onClick={() => {
              updateState('idealPublishDate', undefined)
            }}
          >
            {t(msg.idealPublishDate_default)}
          </Button>
        )}
      </Box>

      <Box marginTop={6} marginBottom={[6, 6, 8]}>
        <Accordion>
          <AccordionItem
            id={draft.id}
            label={t(msg.text)}
            startExpanded={!draft.text.value || !!draft.text.error}
          >
            <Box marginBottom={[4, 4, 8]}>
              <EditorInput
                label={t(msg.text)}
                baseText={'' as HTMLText}
                isImpact={false}
                draftId={draft.id}
                valueRef={textRef}
                error={!!draft.text.error}
                onBlur={() => {
                  updateState('text', textRef.current())
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
          draftId={draft.id}
        />
      </Box>

      <Box>
        {showDraftingNotes && (
          <EditorInput
            label={t(msg.draftingNotes)}
            isImpact={false}
            draftId={`${draft.id}-notes`}
            valueRef={notesRef}
            onBlur={() =>
              updateState(
                'draftingNotes',
                notesRef
                  .current()
                  // Replace empty HTML with empty string ('')
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
    </>
  )
}
