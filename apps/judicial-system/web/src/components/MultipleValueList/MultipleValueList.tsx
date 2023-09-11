import React, { useRef, useState } from 'react'
import InputMask from 'react-input-mask'

import { Button, Input } from '@island.is/island-ui/core'

import BlueBox from '../BlueBox/BlueBox'
import * as styles from './MultipleValueList.css'

interface MultipleValueListProps {
  onAddValue: (nextValue: string) => void
  inputLabel: string
  inputPlaceholder: string
  inputMask?: string
  buttonText: string
  name: string
  isDisabled: (value?: string) => boolean
  hasError?: boolean
  errorMessage?: string
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}

const MultipleValueList: React.FC<
  React.PropsWithChildren<MultipleValueListProps>
> = ({
  children,
  onAddValue,
  inputLabel,
  inputPlaceholder,
  inputMask,
  name,
  buttonText,
  isDisabled,
  hasError,
  errorMessage,
  onBlur,
}) => {
  // State needed since InputMask dose not clear input if invalid value is entered
  const [value, setValue] = useState('')
  const valueRef = useRef<HTMLInputElement>(null)

  const clearInput = () => {
    if (valueRef.current) {
      valueRef.current.value = ''
      valueRef.current.focus()
      setValue('')
    }
  }

  const handleEnter = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !isDisabled(value)) {
      onAddValue(value)
      clearInput()
    }
  }

  return (
    <BlueBox dataTestId="multipleValueListContainer">
      <div className={styles.addCourtDocumentContainer}>
        {inputMask ? (
          <InputMask
            mask={inputMask}
            maskPlaceholder={null}
            onChange={(event) => setValue(event.target.value)}
            onBlur={onBlur}
          >
            <Input
              name={name}
              label={inputLabel}
              placeholder={inputPlaceholder}
              size="sm"
              autoComplete="off"
              ref={valueRef}
              onKeyDown={handleEnter}
              hasError={hasError}
              errorMessage={errorMessage}
            />
          </InputMask>
        ) : (
          <Input
            name={name}
            label={inputLabel}
            placeholder={inputPlaceholder}
            size="sm"
            autoComplete="off"
            onChange={(event) => setValue(event.target.value)}
            ref={valueRef}
            onKeyDown={handleEnter}
            onBlur={onBlur}
            hasError={hasError}
            errorMessage={errorMessage}
          />
        )}
        <Button
          icon="add"
          size="small"
          disabled={isDisabled(value)}
          onClick={() => {
            onAddValue(value)
            clearInput()
          }}
          fluid
        >
          {buttonText}
        </Button>
      </div>
      {children}
    </BlueBox>
  )
}

export default MultipleValueList
