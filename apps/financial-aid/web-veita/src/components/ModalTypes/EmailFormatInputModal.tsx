import React, {
  useState,
  useEffect,
  useRef,
  ClipboardEventHandler,
} from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box } from '@island.is/island-ui/core'
import * as styles from './ModalTypes.css'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (comment?: string) => void
  isModalVisable: boolean
  headline: string
  submitButtonText: string
  errorMessage: string
  prefixText: string
  postfixText: string
}

const EmailFormatInputModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
  headline,
  submitButtonText,
  errorMessage,
  prefixText,
  postfixText,
}: Props) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (hasError) {
      ref.current?.addEventListener('input', () => {
        setHasError(false)
      })
    }
    return () => {
      ref.current?.removeEventListener('input', () => {
        setHasError(false)
      })
    }
  }, [hasError])

  const onPaste = (event: any) => {
    document.execCommand(
      'insertText',
      false,
      event?.clipboardData?.getData('text/plain'),
    )
    event?.preventDefault()
  }

  return (
    <InputModal
      headline={headline}
      onCancel={onCancel}
      onSubmit={() => {
        if (!ref.current?.textContent) {
          setHasError(true)
          return
        }
        onSaveApplication(ref.current.textContent)
      }}
      submitButtonText={submitButtonText}
      isModalVisable={isModalVisable}
      hasError={hasError}
      errorMessage={errorMessage}
    >
      <Box marginBottom={[5, 5, 10]}>
        <Text variant="intro">
          {prefixText}
          {` `}
          <span
            ref={ref}
            contentEditable="true"
            onPaste={onPaste}
            className={styles.rejectionEditable}
          />
          .{` `}
          {postfixText}
        </Text>
      </Box>
    </InputModal>
  )
}

export default EmailFormatInputModal
