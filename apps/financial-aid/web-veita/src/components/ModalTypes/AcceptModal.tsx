import React, { useState } from 'react'

import {
  InputModal,
  NumberInput,
} from '@island.is/financial-aid-web/veita/src/components'
import cn from 'classnames'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (amount: number) => void
  isModalVisable: boolean
}

const AcceptModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
}: Props) => {
  const maximumInputLength = 6
  const [amount, setAmount] = useState<number>(0)
  const [income, setIncome] = useState<number>(0)
  const [personalTax, setPersonalTax] = useState<number>(0)
  const [hasError, setHasError] = useState(false)

  return (
    <InputModal
      headline="Umsóknin þín er samþykkt og áætlun er tilbúin"
      onCancel={onCancel}
      onSubmit={() => {
        if (amount <= 0) {
          setHasError(true)
          return
        }
        onSaveApplication(amount)
      }}
      submitButtonText="Samþykkja"
      isModalVisable={isModalVisable}
      hasError={hasError}
      errorMessage="Þú þarft að setja inn upphæð"
    >
      <Box marginBottom={3}>
        <NumberInput
          id="aid"
          label="Grunnupphæð"
          name="aid"
          placeholder="Skrifaðu upphæð útborgunar"
          onUpdate={(input) => {
            setHasError(false)
            setAmount(input)
          }}
          maximumInputLength={maximumInputLength}
        />
      </Box>
      <Box marginBottom={3}>
        <NumberInput
          id="income"
          label="Tekjur"
          name="income"
          placeholder="Skrifaðu upphæð"
          onUpdate={(input) => {
            setHasError(false)
            setIncome(input)
          }}
          maximumInputLength={maximumInputLength}
        />
      </Box>

      <Box marginBottom={3}>
        <Button icon="add" variant="text">
          Bættu við frádráttarlið
        </Button>
      </Box>

      <Box marginBottom={3}>
        <NumberInput
          id="discount"
          label="Persónuafsláttur"
          name="discount"
          placeholder="Skrifaðu prósentuhlutfall"
          onUpdate={(input) => {
            setHasError(false)
            setPersonalTax(input)
          }}
          maximumInputLength={3}
        />
      </Box>

      <Box marginBottom={3}>
        <Button icon="add" variant="text">
          Bættu við skattkorti
        </Button>
      </Box>

      <Box marginBottom={3}>
        <Input
          label="Skattur"
          name="Test1"
          value={0}
          placeholder="This is the placeholder"
        />
      </Box>

      <Text variant="h3" marginBottom={3}>
        Útreikningur
      </Text>

      <Box
        display="flex"
        justifyContent="spaceBetween"
        background="blue100"
        borderTopWidth="standard"
        borderBottomWidth="standard"
        borderColor="blue200"
        paddingY={2}
        paddingX={3}
        marginBottom={4}
      >
        <Text variant="small">Upphæð aðstoðar</Text>
        <Text> 98.142 kr.</Text>
      </Box>
    </InputModal>
  )
}

export default AcceptModal
