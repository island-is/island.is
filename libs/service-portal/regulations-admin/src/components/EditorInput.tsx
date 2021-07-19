import * as s from './EditorInput.treat'
import { classes } from './Editor.treat'
import React, { MutableRefObject } from 'react'
import {
  Editor as RegulationsEditor,
  EditorProps,
} from '@hugsmidjan/regulations-editor/Editor'
import { HTMLText } from '@island.is/regulations'
import { RegulationDraft } from '@island.is/regulations/admin'

type EditorInputProps = Omit<EditorProps, 'valueRef' | 'name'> & {
  label: string
  // make EditorProps more strict with branded types
  baseText: HTMLText
  initialText?: HTMLText
  valueRef: MutableRefObject<() => HTMLText>
  draftId: string
}

export const EditorInput = (props: EditorInputProps) => {
  return (
    <div className={s.wrap}>
      <h4 className={s.label}>{props.label}</h4>
      <RegulationsEditor
        {...props}
        classes={classes}
        name={'draft-' + props.draftId}
      />
    </div>
  )
}
