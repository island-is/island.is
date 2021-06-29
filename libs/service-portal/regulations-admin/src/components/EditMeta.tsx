import React, { ReactNode, useRef } from 'react'
import { Box, DatePicker, Input, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from './EditorInput'
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

export type EditMetaProps = {
  draft: RegulationDraft
}

export const EditMeta = (props: EditMetaProps) => {
  const t = useIntl().formatMessage
  const { draft } = props
  const textRef = useRef(() => draft.text)

  return (
    <>
      <p>Meta step</p>
    </>
  )
}
