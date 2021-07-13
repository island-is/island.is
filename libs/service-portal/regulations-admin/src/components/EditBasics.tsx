import React, { ReactNode, useRef, useState } from 'react'
import { toISODate } from '@island.is/regulations'
import { Box, DatePicker, Input, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { HTMLText } from '@island.is/regulations'
import { RegDraftForm, useDraftingState } from '../state/useDraftingState'

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

export type EditBasicsProps = {
  draft: RegDraftForm
}

export const EditBasics = (props: EditBasicsProps) => {
  const [inputValue, setInputValue] = useState('')
  const t = useIntl().formatMessage
  const { draft } = props
  const textRef = useRef(() => draft.text.value)
  const { actions } = useDraftingState(draft.id, 'basics')

  const onAnyInputChange = (data: { name: String; value: String }) => {
    actions.updateState({ ...data })
  }

  const onTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value)
    onAnyInputChange({
      name: 'title',
      value: e.target.value,
    })
  }

  return (
    <>
      <Wrap>
        <Input
          label={t(msg.title)}
          name="title"
          value={draft.title.value || inputValue}
          onChange={onTitleChange}
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
          minDate={new Date()}
          handleChange={(date: Date) =>
            onAnyInputChange({
              name: 'idealPublishDate',
              value: toISODate(date),
            })
          }
        />
      </Wrap>
    </>
  )
}
