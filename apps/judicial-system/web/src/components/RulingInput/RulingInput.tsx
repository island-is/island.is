import React, { useEffect, useState } from 'react'
import { Input } from '@island.is/island-ui/core'
import { IntlFormatters, useIntl } from 'react-intl'

import { Case, isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import { ruling as m } from '@island.is/judicial-system-web/messages'

import { useCase, autofillFunc } from '../../utils/hooks'
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

export const autofillRuling = (
  workingCase: Case,
  autofill: autofillFunc,
  formatMessage: IntlFormatters['formatMessage'],
) => {
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
}

export const useRulingAutofill = (
  isCaseUpToDate: boolean,
  workingCase: Case,
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
) => {
  const { formatMessage } = useIntl()
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const { autofill } = useCase()

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      autofillRuling(workingCase, autofill, formatMessage)

      setInitialAutoFillDone(true)
      setWorkingCase({ ...workingCase })
    }
  }, [
    autofill,
    formatMessage,
    initialAutoFillDone,
    isCaseUpToDate,
    setWorkingCase,
    workingCase,
  ])
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
