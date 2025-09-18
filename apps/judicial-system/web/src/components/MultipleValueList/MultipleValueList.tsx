import {
  FC,
  FocusEvent,
  KeyboardEvent,
  PropsWithChildren,
  useRef,
  useState,
} from 'react'
import { InputMask } from '@react-input/mask'

import { Button, Input } from '@island.is/island-ui/core'
import { POLICE_CASE_NUMBER } from '@island.is/judicial-system/consts'

import BlueBox from '../BlueBox/BlueBox'
import * as styles from './MultipleValueList.css'

type MaskType = 'police-case-numbers'

interface MultipleValueListProps {
  onAddValue: (nextValue: string) => void
  inputLabel: string
  inputPlaceholder: string
  inputMask?: MaskType
  buttonText: string
  name: string
  isDisabled: (value?: string) => boolean
  isLoading?: boolean
  hasError?: boolean
  errorMessage?: string
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const MultipleValueList: FC<PropsWithChildren<MultipleValueListProps>> = ({
  children,
  onAddValue,
  inputLabel,
  inputPlaceholder,
  inputMask,
  name,
  buttonText,
  isDisabled,
  isLoading,
  hasError,
  errorMessage,
  onBlur,
}) => {
  // State needed since InputMask dose not clear input if invalid value is entered
  const [value, setValue] = useState('')
  const valueRef = useRef<HTMLInputElement>(null)

  const masks = {
    'police-case-numbers': {
      mask: POLICE_CASE_NUMBER,
      replacement: { _: /\d/ },
    },
  }

  const clearInput = () => {
    if (valueRef.current) {
      valueRef.current.value = ''
      valueRef.current.focus()
      setValue('')
    }
  }

  const handleEnter = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !isDisabled(value)) {
      onAddValue(value)
      clearInput()
    }
  }

  return (
    <BlueBox
      dataTestId="multipleValueListContainer"
      className={styles.container}
    >
      <div className={styles.addCourtDocumentContainer}>
        {inputMask ? (
          <InputMask
            mask={masks[inputMask].mask}
            replacement={masks[inputMask].replacement}
            component={Input}
            onChange={(event) => setValue(event.target.value)}
            onBlur={onBlur}
            name={name}
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={value}
            size="sm"
            autoComplete="off"
            ref={valueRef}
            onKeyDown={handleEnter}
            hasError={hasError}
            errorMessage={errorMessage}
            disabled={isDisabled(value)}
          />
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
            disabled={isDisabled(value)}
          />
        )}
        <Button
          icon="add"
          size="small"
          disabled={isDisabled(value) || value === ''}
          loading={isLoading}
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
