import React, { useState, useRef } from 'react'
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
}

const MultipleValueList: React.FC<MultipleValueListProps> = ({
  children,
  onAddValue,
  inputLabel,
  inputPlaceholder,
  inputMask,
  buttonText,
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
    if (event.key === 'Enter') {
      onAddValue(value)
      clearInput()
    }
  }

  return (
    <BlueBox>
      <div className={styles.addCourtDocumentContainer}>
        {inputMask ? (
          <InputMask
            mask={inputMask}
            maskPlaceholder={null}
            onChange={(event) => setValue(event.target.value)}
          >
            <Input
              name="value-input"
              label={inputLabel}
              placeholder={inputPlaceholder}
              size="sm"
              autoComplete="off"
              ref={valueRef}
              onKeyDown={handleEnter}
            />
          </InputMask>
        ) : (
          <Input
            name="value-input"
            label={inputLabel}
            placeholder={inputPlaceholder}
            size="sm"
            autoComplete="off"
            onChange={(event) => setValue(event.target.value)}
            ref={valueRef}
            onKeyDown={handleEnter}
          />
        )}
        <Button
          icon="add"
          size="small"
          disabled={!value}
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
