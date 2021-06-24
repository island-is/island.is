import React, { ReactNode, useRef } from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from '../components/EditorInput'
import { editorMsgs as msg } from '../messages'
import { RegulationDraft } from '../types-api'

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
  const { formatMessage } = useIntl()
  const { draft } = props
  const textRef = useRef(() => draft.text)

  return (
    <>
      <Wrap>
        <Input
          label={formatMessage(msg.title)}
          name="title"
          value={draft.title}
        />
      </Wrap>

      <Wrap>
        <EditorInput
          label={formatMessage(msg.text)}
          baseText={draft.text}
          isImpact={false}
          draftId={draft.id}
          valueRef={textRef}
        />
      </Wrap>
    </>
  )
}
