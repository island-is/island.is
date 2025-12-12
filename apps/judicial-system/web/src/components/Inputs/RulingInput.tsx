import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { ruling as m } from '@island.is/judicial-system-web/messages'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  rows?: number
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
}

const RulingInput: FC<Props> = ({
  workingCase,
  setWorkingCase,
  rows,
  disabled = false,
  label,
  placeholder,
  required = false,
}) => {
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  useDeb(workingCase, 'ruling')

  return (
    <Input
      data-testid="ruling"
      name="ruling"
      label={label || formatMessage(m.label)}
      placeholder={placeholder || formatMessage(m.placeholder)}
      value={workingCase.ruling || ''}
      required={required}
      onChange={(event) =>
        removeTabsValidateAndSet(
          'ruling',
          event.target.value,
          [],
          setWorkingCase,
        )
      }
      onBlur={(event) =>
        validateAndSendToServer(
          'ruling',
          event.target.value,
          [],
          workingCase,
          updateCase,
        )
      }
      textarea
      rows={rows ?? 16}
      disabled={disabled}
    />
  )
}

export default RulingInput
