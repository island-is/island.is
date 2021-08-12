import * as s from './EditorInput.treat'
import { classes } from './Editor.treat'
import React, { MutableRefObject } from 'react'
import { InputError } from '@island.is/island-ui/core'
import {
  Editor as RegulationsEditor,
  EditorProps,
} from '@hugsmidjan/regulations-editor/Editor'
import { HTMLText } from '@island.is/regulations'

type EditorInputProps = Omit<EditorProps, 'valueRef' | 'name'> & {
  label: string
  // make EditorProps more strict with branded types
  baseText: HTMLText
  error?: boolean
  initialText?: HTMLText
  valueRef: MutableRefObject<() => HTMLText>
  draftId: string
}

export const EditorInput = (props: EditorInputProps) => {
  return (
    <div className={s.wrap}>
      <h4 className={props.error ? s.required : s.label}>
        {props.label}
        <span className={s.required}> *</span>
      </h4>
      {props.error && <InputError errorMessage="Error with this input" />}
      <div className={props.error ? s.errorWrap : undefined}>
        <RegulationsEditor
          {...props}
          classes={classes}
          name={'draft-' + props.draftId}
        />
      </div>
    </div>
  )
}
