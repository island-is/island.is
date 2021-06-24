import * as s from './EditorInput.treat'
import { classes } from './Editor.treat'
import React, { MutableRefObject } from 'react'
import {
  Editor as _Editor,
  EditorProps,
} from '@hugsmidjan/regulations-editor/Editor'
import { HTMLText, RegName } from '@island.is/regulations'
import { RegulationDraft } from '../types-api'

type EditorInputProps = Omit<EditorProps, 'valueRef' | 'name'> & {
  label: string
  // make EditorProps more strict with branded types
  baseText: HTMLText
  initialText?: HTMLText
  valueRef: MutableRefObject<() => HTMLText>
  draftId: RegulationDraft['id']
}

export const EditorInput = (props: EditorInputProps) => {
  return (
    <div className={s.wrap}>
      <h4 className={s.label}>{props.label}</h4>
      <_Editor {...props} classes={classes} name={'draft-' + props.draftId} />
    </div>
  )
}
