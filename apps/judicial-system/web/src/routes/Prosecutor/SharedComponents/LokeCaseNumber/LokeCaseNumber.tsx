import React from 'react'
import InputMask from 'react-input-mask'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  validateAndSendToServer: (
    element: HTMLInputElement | HTMLTextAreaElement,
  ) => Promise<void>
  setField: (element: HTMLInputElement | HTMLTextAreaElement) => void
  policeCaseNumberErrorMessage?: string
}

const LokeCaseNumber: React.FC<Props> = (props) => {
  const {
    workingCase,
    policeCaseNumberErrorMessage,
    validateAndSendToServer,
    setField,
  } = props
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
        onChange={(event) => setField(event.target)}
        onBlur={(event) => validateAndSendToServer(event.target)}
      >
        <Input
          data-testid="policeCaseNumber"
          name="policeCaseNumber"
          label="Slá inn LÖKE málsnúmer"
          placeholder="007-2020-X"
          defaultValue={workingCase.policeCaseNumber}
          errorMessage={policeCaseNumberErrorMessage}
          hasError={policeCaseNumberErrorMessage !== undefined}
          required
        />
      </InputMask>
    </>
  )
}

export default LokeCaseNumber
