import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Box,
  DatePicker,
  Input,
  Text,
  Checkbox,
  AccordionCard,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { HTMLText } from '@island.is/regulations'
import { StepComponent } from '../state/useDraftingState'
import { RegDraftFormSimpleProps } from '../state/types'
import { getMinDate, getNextWorkday } from '../utils'
import { Appendixes, AppendixStateItem } from './Appendixes'
import { RegulationDraftId } from '@island.is/regulations/admin'

type WrapProps = {
  legend?: string
  children: ReactNode
}
const Wrap = (props: WrapProps) => (
  <Box marginBottom={2} aria-label={props.legend}>
    {props.legend && (
      <Text
        variant="small"
        as="h4"
        color="blue400"
        fontWeight="medium"
        marginBottom={1}
      >
        {props.legend}
      </Text>
    )}
    {props.children}
  </Box>
)

export const EditBasics: StepComponent = (props) => {
  const t = useIntl().formatMessage
  const { draft, actions, inputHasError } = props

  const [titleValue, setTitleValue] = useState(draft.title?.value)
  const [dateValue, setDateValue] = useState(draft.idealPublishDate?.value)
  const [fastTrack, setFastTrack] = useState(false)
  const [appendixes, setAppendixes] = useState(
    [] as readonly AppendixStateItem[],
  )

  const textRef = useRef(() => draft.text.value)
  const notesRef = useRef(() => draft.draftingNotes?.value)

  const onAnyInputChange = useCallback(
    (data: { name: RegDraftFormSimpleProps; value: string | Date }) => {
      actions.updateState({ ...data })
    },
    [actions],
  )

  useEffect(() => {
    onAnyInputChange({
      name: 'title',
      value: titleValue,
    })
  }, [titleValue, onAnyInputChange])

  useEffect(() => {
    onAnyInputChange({
      name: 'idealPublishDate',
      value: dateValue as Date,
    })
  }, [dateValue, onAnyInputChange])

  const fastTrackDate = fastTrack ? getNextWorkday(new Date()) : null
  const selectedDate = dateValue ? new Date(dateValue) : null

  console.log('appendixes', appendixes)
  return (
    <>
      <Wrap>
        <Input
          label={t(msg.title)}
          name="title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          required
          errorMessage={t(msg.requiredFieldError)}
          hasError={!!(inputHasError && !draft.title?.value)}
        />
      </Wrap>

      <Wrap>
        <EditorInput
          label={t(msg.text)}
          baseText={'' as HTMLText}
          initialText={draft.text.value}
          isImpact={false}
          draftId={draft.id}
          valueRef={textRef}
          error={
            inputHasError &&
            !textRef.current().replace(/(<(?!\/)[^>]+>)+(<\/[^>]+>)+/, '')
          }
          onChange={() =>
            onAnyInputChange({
              name: 'text',
              value: textRef.current(),
            })
          }
        />
      </Wrap>

      <Wrap>
        <DatePicker
          label={t(msg.idealPublishDate)}
          placeholderText={t(msg.idealPublishDate_soon)}
          minDate={getMinDate()}
          selected={fastTrackDate || selectedDate}
          handleChange={(date: Date) => setDateValue(getNextWorkday(date))} // Auto selects next workday (Excludes weekends and holidays).
          required
          hasError={inputHasError && !(fastTrackDate || selectedDate)}
          errorMessage={t(msg.requiredFieldError)}
          // excludeDates={[]} --> Do we want to exclude holidays and weekends from the calendar?
        />
        <Box marginTop={1}>
          <Checkbox
            label={t(msg.applyForFastTrack)}
            labelVariant="default"
            checked={fastTrack}
            onChange={(e) => setFastTrack(e.target.checked)}
          />
        </Box>
        {/*
          TODO: Add fast track toggler, but only make it shift the minDate to today
          Then let the up-stream state reducer decide if the selected date is indeed a fastTrack request

          draft.fastTrack should alaways be a derived value, based on idealPublishDate
          ...and **POSSIBLY** only when the draftingStatus is "draft" ??? Needs customer input... Not important to resolve right away.
        */}
        <Box marginTop={5}>
          <Appendixes
            appendixes={appendixes}
            onChange={(appendixCallback) =>
              setAppendixes(appendixCallback(appendixes))
            }
            draftId={draft.id}
          />
        </Box>
        <Box marginTop={6}>
          <AccordionCard
            id="drafting-notes"
            label="Minnispunktar"
            labelUse="p"
            labelVariant="default"
            iconVariant="small"
            startExpanded={draft.draftingNotes.value !== ''}
          >
            <EditorInput
              label=""
              baseText={'' as HTMLText}
              initialText={draft.draftingNotes.value}
              isImpact={false}
              draftId={`${draft.id}-notes`}
              valueRef={notesRef}
              onChange={() =>
                onAnyInputChange({
                  name: 'draftingNotes',
                  value: notesRef
                    .current()
                    .replace(/(<(?!\/)[^>]+>)+(<\/[^>]+>)+/, ''), // Replaces empty HTML with empty string ('')
                })
              }
            />
          </AccordionCard>
        </Box>
      </Wrap>
    </>
  )
}
