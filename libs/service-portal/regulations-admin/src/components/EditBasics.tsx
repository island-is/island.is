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
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { HTMLText } from '@island.is/regulations'
import { StepComponent } from '../state/useDraftingState'
import { getMinPublishDate, useLocale } from '../utils'
import { Appendixes, AppendixStateItem } from './Appendixes'
import { MagicTextarea } from './MagicTextarea'

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
        />
      </Box>

      <Box>
        <Inline space="gutter" alignY="center">
          <DatePicker
            size="sm"
            label={t(msg.idealPublishDate)}
            placeholderText={t(msg.idealPublishDate_default)}
            minDate={getMinPublishDate(
              draft.fastTrack.value,
              draft.signatureDate.value,
            )}
            selected={draft.idealPublishDate.value}
            handleChange={(date: Date) => updateState('idealPublishDate', date)}
            hasError={!!draft.idealPublishDate.error}
            errorMessage={t(draft.idealPublishDate.error)}
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
            // startExpanded={!draft.text.value || !!draft.text.error}
          >
            <Box marginBottom={[4, 4, 8]}>
              <EditorInput
                label={t(msg.text)}
                baseText={'' as HTMLText}
                isImpact={false}
                draftId={draft.id}
                valueRef={textRef}
                error={t(draft.text.error)}
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
          defaultClosed
          draftId={draft.id}
        />
      </Box>
    </>
  )
}
