import { Input } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import React, { useState } from 'react'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import useCase from '../../utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isRequired: boolean
}

const RulingInput: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isRequired } = props
  const { updateCase } = useCase()
  const [rulingErrorMessage, setRulingErrorMessage] = useState('')

  return (
    <Input
      data-testid="ruling"
      name="ruling"
      label="Efni úrskurðar"
      placeholder="Hver er niðurstaðan að mati dómara?"
      defaultValue={workingCase.ruling}
      rows={16}
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
