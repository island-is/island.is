import React, { useState, useRef } from 'react'
import InputMask from 'react-input-mask'
import { useKey } from 'react-use'

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
  const [nextValue, setNextValue] = useState<string>('')
  const valueRef = useRef<HTMLInputElement>(null)

  // Add document on enter press
  useKey(
    'Enter',
    () => {
      onAddValue(nextValue)
      clearInput()
    },
    undefined,
    [nextValue],
  )

  const clearInput = () => {
    if (valueRef.current) {
      valueRef.current.value = ''
      valueRef.current.focus()
    }
  }

  return (
    <BlueBox>
      <div className={styles.addCourtDocumentContainer}>
        {inputMask ? (
          <InputMask
            mask={inputMask}
            maskPlaceholder={null}
            onChange={(evt) => setNextValue(evt.target.value)}
          >
            <Input
              name="value-input"
              label={inputLabel}
              placeholder={inputPlaceholder}
              size="sm"
              autoComplete="off"
              ref={valueRef}
            />
          </InputMask>
        ) : (
          <Input
            name="value-input"
            label={inputLabel}
            placeholder={inputPlaceholder}
            size="sm"
            autoComplete="off"
            onChange={(evt) => setNextValue(evt.target.value)}
            ref={valueRef}
          />
        )}
        <Button
          icon="add"
          size="small"
          disabled={!nextValue}
          onClick={() => {
            onAddValue(nextValue)
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
