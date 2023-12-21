import React, { useState, useEffect, useRef, ChangeEvent } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Input } from '@island.is/island-ui/core'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import * as styles from './ModalTypes.css'
import is from 'libs/island-ui/core/src/lib/Hyphen/patterns/is'

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

  const errorCheckOnTextContent = (textContent?: string | null) => {
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

  const handleInput = (e: ChangeEvent<HTMLDivElement>) => {
    console.log('innerText:', e.target.innerText, ref.current?.innerHTML)
    const innerText = e.target.innerText
    if (
      !innerText.includes('[SKRIFA ÁSTÆÐU HÉR]') &&
      ref.current?.innerHTML.includes('<b>')
    ) {
      ref.current.innerHTML = ref.current.innerHTML.replace('<b>', '')
      ref.current.innerHTML = ref.current.innerHTML.replace('</b>', '')
    }
  }

  return (
    <InputModal
      headline={headline}
      onCancel={onCancel}
      onSubmit={() => {
        if (errorCheckOnTextContent(ref.current?.textContent)) {
          setHasError(true)
          return
        }
        console.log('fer í gegn')
        // onSaveApplication(ref.current.textContent)
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
        >
          {prefixText}
          <br />
          <br />
          <b>[SKRIFA ÁSTÆÐU HÉR]</b>
          <br />
          {postfixText}
          {state === ApplicationState.REJECTED && (
            <>
              <br />
              <br /> <br />
              <b>Málskot</b>
              Bent skal á að unnt er að skjóta ákvörðun þessari til
              áfrýjunarnefndar þíns sveitarfélags. Skal það gert skriflega og
              innan fjögurra vikna. Fyrir frekari upplýsingar um málskot hafðu
              samband með tölvupósti á netfangið{' '}
              <a href={`mailto:${municipalityEmail}`} rel="noreferrer noopener">
                <span className="linkInText">{municipalityEmail}.</span>
              </a>
              <br />
              <br />
              Ákvörðun ráðsins má síðan skjóta til úrskurðarnefndar
              velferðarmála, Katrínartúni 2, 105 Reykjavík innan þriggja mánaða.
              <br />
              <br />
            </>
          )}
        </div>
      </Box>
    </InputModal>
  )
}

export default EmailFormatInputModal
