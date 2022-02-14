import React, { useContext } from 'react'
import { Input, Box } from '@island.is/island-ui/core'
import { FormContext } from '../FormProvider/FormProvider'

interface Props {
  hasError: boolean
  removeError: () => void
}

const SpouseEmailInput = ({ hasError, removeError }: Props) => {
  const { form, updateForm } = useContext(FormContext)

  return (
    <Box marginBottom={[2, 2, 3]}>
      <Input
        label="Netfang maka"
        name="emailSpouse"
        data-testid="emailSpouse"
        id="email"
        placeholder="Sláðu inn netfang maka"
        backgroundColor="blue"
        hasError={hasError}
        errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
        type="email"
        value={form?.spouse?.email}
        onChange={(event) => {
          removeError()
          updateForm({
            ...form,
            spouse: {
              ...form.spouse,
              email: event.target.value,
            },
          })
        }}
      />
    </Box>
  )
}

export default SpouseEmailInput
