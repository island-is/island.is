import React, { useState, useEffect, useRef } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box } from '@island.is/island-ui/core'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

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
  state: ApplicationState
  muncipalityEmail?: string
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
  state,
  muncipalityEmail,
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
      <Box
        marginBottom={
          state === ApplicationState.REJECTED ? [5, 5, 6] : [5, 5, 10]
        }
      >
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

        {state === ApplicationState.REJECTED && (
          <>
            <Text
              marginTop={3}
              marginBottom={3}
              fontWeight="semiBold"
              variant="intro"
            >
              Málskot
            </Text>

            <Text variant="intro">
              Bent skal á að unnt er að skjóta ákvörðun þessari til
              áfrýjunarnefndar þíns sveitarfélags. Skal það gert skriflega og
              innan fjögurra vikna. Fyrir frekari upplýsingar um málskot hafðu
              samband með tölvupósti á netfangið{' '}
              <a href={`mailto:${muncipalityEmail}`} rel="noreferrer noopener">
                <span className="linkInText">{muncipalityEmail}</span>
              </a>
              . 
              <br />
              <br />
              Ákvörðun ráðsins má síðan skjóta til úrskurðarnefndar
              velferðarmála, Katrínartúni 2, 105 Reykjavík innan þriggja mánaða.
            </Text>
          </>
        )}
      </Box>
    </InputModal>
  )
}

export default EmailFormatInputModal
