import * as s from './EditorInput.css'
import { classes } from './Editor.css'

import { useRef, useState } from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import {
  Editor as RegulationsEditor,
  EditorProps,
} from '@dmr.is/regulations-tools/Editor'
import cn from 'classnames'
import { HTMLText, useDomid } from '@island.is/regulations'
import { RegulationDraftId } from '@island.is/regulations/admin'
import { editorMsgs as msg } from '../lib/messages'
import { useFileUploader } from '../utils/fileUploader'
import { fileUrl } from '../utils/dataHooks'
import { useLocale } from '@island.is/localization'

const KB = 1024

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

  const t = useLocale().formatMessage
  const valueRef = useRef(() => value)
  const [hasFocus, setHasFocus] = useState(false)
  const domid = useDomid()
  const labelId = domid + '-label'
  const hasError = !!error || undefined
  const errorId = hasError && domid + '-error'

  const srOnlyClass = hiddenLabel ? ' ' + s.srOnly : ''

  const fileUploader = useFileUploader(props.draftId)

  // add warnings at the top of the editor for longer content.
  const warningsAbove = props.warningsAbove ?? value.length > 1 * KB

  return (
    <>
      <Box
        background="white"
        className={cn(
          s.container,
          isImpact && s.isImpact,
          hasError && s.hasError,
          hasFocus && s.hasFocus,
          editorProps.disabled && s.containerDisabled,
          editorProps.readOnly && s.readOnly,
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
          fileUploader={fileUploader()}
          baseText={baseText}
          uploadUrl={`${fileUrl}/admin-drafts/files/${props.draftId}`}
          documentLoaderElement={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={1}
            >
              <Box display="inlineBlock" marginRight={3}>
                {t(msg.uploadingWordDocument)}
              </Box>
              <LoadingDots />
            </Box>
          }
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
