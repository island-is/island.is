import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './CaseNumberInput.strings'

const CaseNumberInput = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const [appealCaseNumberErrorMessage, setAppealCaseNumberErrorMessage] =
    useState<string>('')
  const { updateCase } = useCase()

  return (
    <Input
      name="appealCaseNumber"
      label={formatMessage(strings.caseNumberLabel)}
      value={workingCase.appealCaseNumber ?? ''}
      placeholder={formatMessage(strings.caseNumberPlaceholder, {
        year: new Date().getFullYear(),
      })}
      errorMessage={appealCaseNumberErrorMessage}
      onChange={(event) => {
        removeTabsValidateAndSet(
          'appealCaseNumber',
          event.target.value,
          ['empty', 'appeal-case-number-format'],
          workingCase,
          setWorkingCase,
          appealCaseNumberErrorMessage,
          setAppealCaseNumberErrorMessage,
        )
      }}
      onBlur={(event) => {
        validateAndSendToServer(
          'appealCaseNumber',
          event.target.value,
          ['empty', 'appeal-case-number-format'],
          workingCase,
          updateCase,
          setAppealCaseNumberErrorMessage,
        )
      }}
      required
    />
  )
}

export default CaseNumberInput
