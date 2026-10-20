import type { FC } from 'react'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import { replaceTabs } from '@island.is/judicial-system-web/src/utils/formatters'
import { useAppealCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { applyAppealCaseUpdate } from '@island.is/judicial-system-web/src/utils/utils'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { strings } from './CaseNumberInput.strings'

interface Props {
  // The appeal the number belongs to. The page decides which of the case's
  // appeals it is about, so the input takes it rather than resolving it.
  appealCase: AppealCase | null | undefined
}

const CaseNumberInput: FC<Props> = ({ appealCase }) => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const [appealCaseNumberErrorMessage, setAppealCaseNumberErrorMessage] =
    useState<string>('')
  const { updateAppealCase } = useAppealCase()

  return (
    <Input
      name="appealCaseNumber"
      label={formatMessage(strings.caseNumberLabel)}
      value={appealCase?.appealCaseNumber ?? ''}
      placeholder={formatMessage(strings.caseNumberPlaceholder, {
        year: new Date().getFullYear(),
      })}
      errorMessage={appealCaseNumberErrorMessage}
      onChange={(event) => {
        const value = replaceTabs(event.target.value)

        if (appealCase?.id) {
          setWorkingCase((prev) =>
            applyAppealCaseUpdate(prev, appealCase.id, {
              appealCaseNumber: value,
            }),
          )
        }

        const { isValid, errorMessage } = validate([
          [value, ['empty', 'appeal-case-number-format']],
        ])

        if (isValid) {
          setAppealCaseNumberErrorMessage('')
        } else if (appealCaseNumberErrorMessage) {
          setAppealCaseNumberErrorMessage(errorMessage)
        }
      }}
      onBlur={(event) => {
        const value = event.target.value

        const validationResult = validate([
          [value, ['empty', 'appeal-case-number-format']],
        ])

        if (validationResult.isValid) {
          setAppealCaseNumberErrorMessage('')

          if (appealCase?.id) {
            updateAppealCase(workingCase.id, appealCase.id, {
              appealCaseNumber: value,
            })
          }
        } else {
          setAppealCaseNumberErrorMessage(validationResult.errorMessage ?? '')
        }
      }}
      required
    />
  )
}

export default CaseNumberInput
