import React, { useState, useEffect, useRef } from 'react'

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
  textBeforeInput: string
  textAfterInput: string
}

const EmailFormatInputModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
  headline,
  submitButtonText,
  errorMessage,
  textBeforeInput,
  textAfterInput,
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
          {`${textBeforeInput} `}
          <span
            ref={ref}
            contentEditable="true"
            className={styles.rejectionEditable}
          />
          .{` ${textAfterInput}`}
        </Text>
      </Box>
    </InputModal>
  )
}

export default EmailFormatInputModal
