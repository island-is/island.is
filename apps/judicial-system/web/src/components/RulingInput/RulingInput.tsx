import { Input } from '@island.is/island-ui/core'
import { Case, isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import { useCase } from '../../utils/hooks'
import { ruling as m } from '@island.is/judicial-system-web/messages'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isRequired: boolean
  rows?: number
}

const RulingInput: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isRequired, rows } = props
  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()
  const [rulingErrorMessage, setRulingErrorMessage] = useState('')

  useEffect(() => {
    if (!workingCase.parentCase) {
      autofill(
        'ruling',
        `\n${formatMessage(m.autofill, {
          judgeName: workingCase.judge?.name,
        })}`,
        workingCase,
      )
    } else if (
      workingCase.parentCase.ruling &&
      isAcceptingCaseDecision(workingCase.decision)
    ) {
      autofill('ruling', workingCase.parentCase.ruling, workingCase)
    }
  }, [workingCase, autofill, formatMessage])

  return (
    <Input
      data-testid="ruling"
      name="ruling"
      label={formatMessage(m.label)}
      placeholder={formatMessage(m.placeholder)}
      defaultValue={workingCase.ruling}
      rows={rows ?? 16}
      errorMessage={rulingErrorMessage}
      hasError={rulingErrorMessage !== ''}
      required={isRequired}
      onChange={(event) =>
        removeTabsValidateAndSet(
          'ruling',
          event,
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
    />
  )
}

export default RulingInput
