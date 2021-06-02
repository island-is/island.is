import React from 'react'
import InputMask from 'react-input-mask'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  policeCaseNumberErrorMessage?: string
  setPoliceCaseNumberErrorMessage?: React.Dispatch<React.SetStateAction<string>>
}

const LokeCaseNumber: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    policeCaseNumberErrorMessage,
    setPoliceCaseNumberErrorMessage,
  } = props

  const { updateCase } = useCase()

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          Málsnúmer lögreglu
        </Text>
      </Box>
      <InputMask
        // This is temporary until we start reading LÖKE case numbers from LÖKE
        mask="999-9999-9999999"
        maskPlaceholder={null}
        onChange={(event) =>
          removeTabsValidateAndSet(
            'policeCaseNumber',
            event,
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
          label="Slá inn LÖKE málsnúmer"
          placeholder={`007-${new Date().getFullYear()}-X`}
          defaultValue={workingCase.policeCaseNumber}
          errorMessage={policeCaseNumberErrorMessage}
          hasError={policeCaseNumberErrorMessage !== ''}
          required
        />
      </InputMask>
    </>
  )
}

export default LokeCaseNumber
