import React, { useContext, useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import { Box, Input, Text } from '@island.is/island-ui/core'
import type { Case } from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { policeCaseNumber } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}

const LokeCaseNumber: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { user } = useContext(UserContext)
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()
  const [
    policeCaseNumberErrorMessage,
    setPoliceCaseNumberErrorMessage,
  ] = useState<string>('')

  useEffect(() => {
    if (!workingCase.policeCaseNumber) {
      setWorkingCase({
        ...workingCase,
        policeCaseNumber: user?.institution?.policeCaseNumberPrefix ?? '',
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {formatMessage(policeCaseNumber.heading)}
        </Text>
      </Box>
      <InputMask
        // This is temporary until we start reading LÖKE case numbers from LÖKE
        mask="999-9999-9999999"
        maskPlaceholder={null}
        value={workingCase.policeCaseNumber}
        onChange={(event) =>
          removeTabsValidateAndSet(
            'policeCaseNumber',
            event.target.value,
            ['empty', 'police-casenumber-format'],
            workingCase,
            setWorkingCase,
            policeCaseNumberErrorMessage,
            setPoliceCaseNumberErrorMessage,
          )
        }
        onBlur={(event) =>
          validateAndSendToServer(
            'policeCaseNumber',
            event.target.value,
            ['empty', 'police-casenumber-format'],
            workingCase,
            updateCase,
            setPoliceCaseNumberErrorMessage,
          )
        }
      >
        <Input
          data-testid="policeCaseNumber"
          name="policeCaseNumber"
          autoComplete="off"
          label={formatMessage(policeCaseNumber.label)}
          placeholder={formatMessage(policeCaseNumber.placeholder, {
            prefix: user?.institution?.policeCaseNumberPrefix ?? '',
            year: new Date().getFullYear(),
          })}
          errorMessage={policeCaseNumberErrorMessage}
          hasError={policeCaseNumberErrorMessage !== ''}
          required
        />
      </InputMask>
    </>
  )
}

export default LokeCaseNumber
