import React from 'react'
import { useIntl } from 'react-intl'
import { Text } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'
import * as style from './Modal.treat'

interface ControlCodeProps {
  controlCode: string
}

const ControlCode = ({ controlCode }: ControlCodeProps) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Text variant="h2" marginBottom={2}>
        {formatMessage(signatureModal.security.numberLabel)}
        <span className={style.controlCode}>{controlCode}</span>
      </Text>
      <Text>{formatMessage(signatureModal.security.message)}</Text>
    </>
  )
}

export default ControlCode
