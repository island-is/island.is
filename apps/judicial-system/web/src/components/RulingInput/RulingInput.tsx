import React, { useState } from 'react'
import { Input } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'

import { Case } from '@island.is/judicial-system/types'
import { ruling as m } from '@island.is/judicial-system-web/messages'

import { useCase } from '../../utils/hooks'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import useDeb from '../../utils/hooks/useDeb'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isRequired: boolean
  rows?: number
}

const RulingInput: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isRequired, rows } = props
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()
  const [rulingErrorMessage, setRulingErrorMessage] = useState('')

  useDeb(workingCase, 'ruling')

  return (
    <Input
      data-testid="ruling"
      name="ruling"
      label={formatMessage(m.label)}
      placeholder={formatMessage(m.placeholder)}
      value={workingCase.ruling || ''}
      errorMessage={rulingErrorMessage}
      hasError={rulingErrorMessage !== ''}
      required={isRequired}
      onChange={(event) =>
        removeTabsValidateAndSet(
          'ruling',
          event.target.value,
          ['empty'],
          workingCase,
          setWorkingCase,
          rulingErrorMessage,
          setRulingErrorMessage,
        )
      }
      onBlur={(event) =>
        validateAndSendToServer(
          'ruling',
          event.target.value,
          ['empty'],
          workingCase,
          updateCase,
          setRulingErrorMessage,
        )
      }
      textarea
      rows={rows ?? 16}
      autoExpand={{
        on: !rows,
        maxHeight: 600,
      }}
    />
  )
}

export default RulingInput
