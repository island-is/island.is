import * as s from './EditorInput.css'
import { classes } from './Editor.css'

import React, { useRef, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import {
  Editor as RegulationsEditor,
  EditorProps,
} from '@island.is/regulations-tools/Editor'
import cn from 'classnames'
import { HTMLText, useDomid } from '@island.is/regulations'
import { RegulationDraftId } from '@island.is/regulations/admin'

type EditorInputProps = Omit<
  EditorProps,
  'name' | 'valueRef' | 'onBlur' | 'onFocus' | 'onChange'
> & {
  value: HTMLText
  label: string
  hiddenLabel?: boolean
  required?: boolean
  // make EditorProps more strict with branded types
  error?: string
  draftId: RegulationDraftId
  /** Called on editor blur */
  onChange: (newValue: HTMLText) => void
}

export const EditorInput = (props: EditorInputProps) => {
  const {
    error,
    label,
    hiddenLabel,
    draftId,
    onChange,
    value,
    required,
    ...editorProps
  } = props
  const valueRef = useRef(() => value)
  const [hasFocus, setHasFocus] = useState(false)
  const domid = useDomid()
  const labelId = domid + '-label'
  const hasError = !!error || undefined
  const errorId = hasError && domid + '-error'

  const srOnlyClass = hiddenLabel ? ' ' + s.srOnly : ''

  return (
    <>
      <Box
        background="white"
        className={cn(
          s.container,
          hasError && s.hasError,
          hasFocus && s.hasFocus,
        )}
      >
        <h4 className={cn(s.label + srOnlyClass)} id={labelId}>
          {label}
          {required && <span className={s.isRequiredStar}> *</span>}
        </h4>
        <RegulationsEditor
          {...editorProps}
          valueRef={valueRef}
          classes={classes}
          name={'draft-' + draftId}
          onFocus={() => {
            setHasFocus(true)
          }}
          onBlur={() => {
            setHasFocus(false)
            onChange(valueRef.current())
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
