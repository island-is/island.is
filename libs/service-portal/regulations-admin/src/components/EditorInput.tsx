import * as s from './EditorInput.treat'
import { classes } from './Editor.treat'

import React, { useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import {
  Editor as RegulationsEditor,
  EditorProps,
} from '@hugsmidjan/regulations-editor/Editor'
import cn from 'classnames'

type EditorInputProps = Omit<EditorProps, 'name'> & {
  label: string
  // make EditorProps more strict with branded types
  error?: boolean
  draftId: string
}

export const EditorInput = (props: EditorInputProps) => {
  const { error, label, draftId, onFocus, onBlur, ...editorProps } = props
  const [hasFocus, setHasFocus] = useState(false)
  const labelId = draftId + '-label'
  const hasError = !!error || undefined
  const errorId = hasError && draftId + '-error'

  return (
    <>
      <Box
        background="white"
        className={cn(s.container, {
          [s.hasError]: hasError,
          [s.hasFocus]: hasFocus,
        })}
      >
        <h4 className={s.label} id={labelId}>
          {label}
          <span className={s.isRequiredStar}> *</span>
        </h4>
        <RegulationsEditor
          {...editorProps}
          classes={classes}
          name={'draft-' + draftId}
          onFocus={() => {
            setHasFocus(true)
            onFocus && onFocus()
          }}
          onBlur={() => {
            setHasFocus(false)
            onBlur && onBlur()
          }}
          aria-labelledBy={labelId}
          aria-describedBy={errorId}
        />
      </Box>
      {hasError && (
        <div
          className={s.errorMessage}
          id={errorId}
          aria-live="assertive"
          data-testid="inputErrorMessage"
        >
          {error}
        </div>
      )}
    </>
  )
}
