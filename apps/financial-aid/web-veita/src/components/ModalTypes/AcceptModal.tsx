import React from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Input, Text, Box } from '@island.is/island-ui/core'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AcceptModal = ({ onCancel }: Props) => {
  const inputFields = [
    {
      label: 'Skattur',
    },
    {
      label: 'Persónuafsláttur',
    },
    {
      label: 'Ofgreiðsla',
    },
    {
      label: 'Annað',
    },
  ]

  return (
    <InputModal
      headline="Umsóknin þín er samþykkt og áætlun er tilbúin"
      onCancel={onCancel}
      onSubmit={() => {
        console.log('hello')
      }}
      submitButtonText="Samþykkja"
    >
      {inputFields.map((el) => {
        return (
          <Box marginBottom={3}>
            <Input
              label={el.label}
              name="Test5"
              placeholder="Skrifaðu upphæð"
              backgroundColor="blue"
            />
          </Box>
        )
      })}
    </InputModal>
  )
}

export default AcceptModal
