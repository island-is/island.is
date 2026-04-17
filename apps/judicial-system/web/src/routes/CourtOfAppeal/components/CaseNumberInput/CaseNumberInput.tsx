import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useAppealCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { strings } from './CaseNumberInput.strings'

const CaseNumberInput: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const [appealCaseNumberErrorMessage, setAppealCaseNumberErrorMessage] =
    useState<string>('')
  const { updateAppealCase } = useAppealCase()

  return (
    <Input
      name="appealCaseNumber"
      label={formatMessage(strings.caseNumberLabel)}
      value={workingCase.appealCase?.appealCaseNumber ?? ''}
      placeholder={formatMessage(strings.caseNumberPlaceholder, {
        year: new Date().getFullYear(),
      })}
      errorMessage={appealCaseNumberErrorMessage}
      onChange={(event) => {
        removeTabsValidateAndSet(
          'appealCaseNumber',
          event.target.value,
          ['empty', 'appeal-case-number-format'],
          setWorkingCase,
          appealCaseNumberErrorMessage,
          setAppealCaseNumberErrorMessage,
        )
      }}
      onBlur={(event) => {
        const value = event.target.value

        const validationResult = validate([
          [value, ['empty', 'appeal-case-number-format']],
        ])

        if (validationResult.isValid) {
          setAppealCaseNumberErrorMessage('')

          if (workingCase.appealCase?.id) {
            updateAppealCase(workingCase.id, workingCase.appealCase.id, {
              appealCaseNumber: value,
            })
          }
        } else {
          setAppealCaseNumberErrorMessage(
            validationResult.errorMessage ?? '',
          )
        }
      }}
      required
    />
  )
}

export default CaseNumberInput
