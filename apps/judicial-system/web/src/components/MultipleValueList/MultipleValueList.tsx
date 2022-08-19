import React, { useState, useRef } from 'react'
import { useKey } from 'react-use'
import { useIntl } from 'react-intl'

import { Button, Input } from '@island.is/island-ui/core'
import { courtDocuments as m } from '@island.is/judicial-system-web/messages'

import BlueBox from '../BlueBox/BlueBox'
import * as styles from './MultipleValueList.css'

interface MultipleValueListProps {
  onAddValue: (nextValue: string) => void
}

const MultipleValueList: React.FC<MultipleValueListProps> = ({
  children,
  onAddValue,
}) => {
  const { formatMessage } = useIntl()
  const [nextValue, setNextValue] = useState<string>('')
  const additionalCourtDocumentRef = useRef<HTMLInputElement>(null)

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
    if (additionalCourtDocumentRef.current) {
      additionalCourtDocumentRef.current.value = ''
      additionalCourtDocumentRef.current.focus()
    }
  }

  return (
    <BlueBox>
      <div className={styles.addCourtDocumentContainer}>
        <Input
          name="add-court-document"
          label={formatMessage(m.add.label)}
          placeholder={formatMessage(m.add.placeholder)}
          size="sm"
          autoComplete="off"
          onChange={(evt) => setNextValue(evt.target.value)}
          ref={additionalCourtDocumentRef}
        />
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
          {formatMessage(m.add.buttonText)}
        </Button>
      </div>
      {children}
    </BlueBox>
  )
}

export default MultipleValueList
