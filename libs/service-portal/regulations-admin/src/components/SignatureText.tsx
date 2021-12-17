import React, { useRef } from 'react'
import { HTMLText } from '@island.is/regulations-tools/types'
import { Box } from '@island.is/island-ui/core'
import { RegDraftForm } from '../state/types'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { useLocale } from '../utils'

export type SignatureTextProps = {
  draft: RegDraftForm
  onChange: (text: HTMLText) => void
}

export const SignatureText = (props: SignatureTextProps) => {
  const { draft, onChange } = props

  const t = useLocale().formatMessage
  const signatureTextRef = useRef(() => draft.signatureText.value)

  return (
    <EditorInput
      label={t(msg.signatureText)}
      isImpact={false}
      draftId={`${draft.id}-signature`}
      valueRef={signatureTextRef}
      onBlur={() =>
        onChange(
          signatureTextRef
            .current()
            // Replace empty HTML with empty string ('')
            // TODO: See if this should rather happen in the reducer/action
            .replace(/(<(?!\/)[^>]+>)+(<\/[^>]+>)+/, '') as HTMLText,
        )
      }
    />
  )
}
