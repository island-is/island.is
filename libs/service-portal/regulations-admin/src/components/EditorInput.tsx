import * as s from './EditorInput.css'
import { classes, impactClasses } from './Editor.css'

import React, { useMemo, useRef, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import {
  Editor as RegulationsEditor,
  EditorProps,
  EditorFileUploader,
} from '@island.is/regulations-tools/Editor'
import cn from 'classnames'
import { HTMLText, useDomid } from '@island.is/regulations'
import { RegulationDraftId } from '@island.is/regulations/admin'

const KB = 1024

const _fileUploader = (draftId: RegulationDraftId): EditorFileUploader => (
  blobInfo,
  success,
  failure,
  progress,
) => {
  // TODO: Implement uploader
  failure('TODO: Implement uploader for ' + blobInfo.filename())
}

// ===========================================================================

export type EditorInputProps = Omit<
  EditorProps,
  'valueRef' | 'onBlur' | 'onFocus' | 'onChange' | 'fileUploader'
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
    baseText,
    isImpact,
    ...editorProps
  } = props

  const valueRef = useRef(() => value)
  const [hasFocus, setHasFocus] = useState(false)
  const domid = useDomid()
  const labelId = domid + '-label'
  const hasError = !!error || undefined
  const errorId = hasError && domid + '-error'

  const srOnlyClass = hiddenLabel ? ' ' + s.srOnly : ''

  const fileUploader = useMemo(() => _fileUploader(props.draftId), [
    props.draftId,
  ])

  // add warnings at the top of the editor for longer content.
  const warningsAbove = props.warningsAbove ?? value.length > 1 * KB

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
          classes={isImpact ? impactClasses : classes}
          fileUploader={fileUploader}
          baseText={baseText}
          onFocus={() => {
            setHasFocus(true)
          }}
          onBlur={() => {
            setHasFocus(false)
            onChange(valueRef.current())
          }}
          aria-labelledBy={labelId}
          aria-describedBy={errorId}
          warningsAbove={warningsAbove}
          isImpact={isImpact}
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
