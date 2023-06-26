import React from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
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
  rows?: number
}

const RulingInput: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, rows } = props
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  useDeb(workingCase, 'ruling')

  return (
    <Input
      data-testid="ruling"
      name="ruling"
      label={formatMessage(m.label)}
      placeholder={formatMessage(m.placeholder)}
      value={workingCase.ruling || ''}
      onChange={(event) =>
        removeTabsValidateAndSet(
          'ruling',
          event.target.value,
          [],
          workingCase,
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
      autoExpand={{
        on: !rows,
        maxHeight: 600,
      }}
    />
  )
}

export default RulingInput
