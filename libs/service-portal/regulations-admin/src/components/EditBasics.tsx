import React, { ReactNode, useRef } from 'react'
import { Box, DatePicker, Input, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { RegulationDraft } from '../types-api'
import { HTMLText } from '@hugsmidjan/regulations-editor/types'

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
  draft: RegulationDraft
}

export const EditBasics = (props: EditBasicsProps) => {
  const t = useIntl().formatMessage
  const { draft } = props
  const textRef = useRef(() => draft.text)

  return (
    <>
      <Wrap>
        <Input label={t(msg.title)} name="title" value={draft.title} />
      </Wrap>

      <Wrap>
        <EditorInput
          label={t(msg.text)}
          baseText={'' as HTMLText}
          initialText={draft.text}
          isImpact={false}
          draftId={draft.id}
          valueRef={textRef}
        />
      </Wrap>

      <Wrap>
        <DatePicker
          label={t(msg.idealPublishDate)}
          placeholderText={t(msg.idealPublishDate_soon)}
          minDate={new Date()}
        />
      </Wrap>
    </>
  )
}
