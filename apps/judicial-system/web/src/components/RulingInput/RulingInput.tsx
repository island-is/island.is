import React, { useEffect, useState } from 'react'
import { Input } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'

import { Case, isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import { ruling as m } from '@island.is/judicial-system-web/messages'

import { useCase } from '../../utils/hooks'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isCaseUpToDate: boolean
  isRequired: boolean
  rows?: number
}

const RulingInput: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    isCaseUpToDate,
    isRequired,
    rows,
  } = props
  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()
  const [rulingErrorMessage, setRulingErrorMessage] = useState('')

  useDebounce(
    () => {
      updateCase(workingCase.id, { ruling: workingCase.ruling })
    },
    2000,
    [workingCase.ruling],
  )

  useEffect(() => {
    if (isCaseUpToDate) {
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
  }, [autofill, formatMessage, isCaseUpToDate, workingCase])

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
