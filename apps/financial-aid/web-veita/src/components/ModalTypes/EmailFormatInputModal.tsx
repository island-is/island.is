import React, { useState, useEffect, useRef, ChangeEvent } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Box } from '@island.is/island-ui/core'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import * as styles from './ModalTypes.css'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (comment?: string) => void
  isModalVisable: boolean
  headline: string
  submitButtonText: string
  defaultErrorMessage: string
  prefixText: string
  postfixText: string
  state: ApplicationState
  municipalityEmail?: string
}

const EmailFormatInputModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
  headline,
  submitButtonText,
  defaultErrorMessage,
  prefixText,
  postfixText,
  state,
  municipalityEmail,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>(defaultErrorMessage)

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

  const errorCheckOnTextcontent = (textContent?: string | null) => {
    if (!textContent) {
      setErrorMessage(defaultErrorMessage)
      return true
    }
    if (textContent === '') {
      setErrorMessage(defaultErrorMessage)
      return true
    }
    if (textContent.includes('SKRIFA ÁSTÆÐU HÉR')) {
      setErrorMessage("Þú þarft að fjarlægja '[SKRIFA ÁSTÆÐU HÉR]' í textanum")
      return true
    }
    if (textContent.includes('[') || textContent.includes(']')) {
      setErrorMessage("Þú þarft að fjarlægja '[' í textanum")
      return true
    }
    if (textContent.includes(']')) {
      setErrorMessage("Þú þarft að fjarlægja ']' í textanum")
      return true
    }

    return false
  }

  return (
    <InputModal
      headline={headline}
      onCancel={onCancel}
      onSubmit={() => {
        if (
          !ref?.current?.innerText ||
          errorCheckOnTextcontent(ref?.current?.innerText)
        ) {
          setHasError(true)
          return
        }
        onSaveApplication(ref.current.innerText)
      }}
      submitButtonText={submitButtonText}
      isModalVisable={isModalVisable}
      hasError={hasError}
      errorMessage={errorMessage}
    >
      <Box marginBottom={state === ApplicationState.REJECTED ? [5, 5, 6] : 2}>
        <div
          ref={ref}
          contentEditable={true}
          onPaste={onPaste}
          className={styles.textAreaEditable}
          suppressContentEditableWarning={true}
        >
          {prefixText}
          <br />
          <br />
          <strong>[SKRIFA ÁSTÆÐU HÉR]</strong>
          <br />
          {postfixText}

          {state === ApplicationState.REJECTED && (
            <>
              <br />
              <br />
              <b>Málskot</b>
              <br />
              Bent skal á að unnt er að skjóta ákvörðun þessari til
              áfrýjunarnefndar þíns sveitarfélags. Skal það gert skriflega og
              innan fjögurra vikna. Fyrir frekari upplýsingar um málskot hafðu
              samband með tölvupósti á netfangið
              <a href={'mailto:${municipalityEmail}'} rel="noreferrer noopener">
                <span className="linkInText">{municipalityEmail}.</span>
              </a>
              <br />
              <br />
              Ákvörðun ráðsins má síðan skjóta til úrskurðarnefndar
              velferðarmála, Katrínartúni 2, 105 Reykjavík innan þriggja mánaða.
            </>
          )}
        </div>
      </Box>
    </InputModal>
  )
}

export default EmailFormatInputModal
