import React, { useState } from 'react'

import {
  InputModal,
  NumberInput,
} from '@island.is/financial-aid-web/veita/src/components'
import { Input, Box } from '@island.is/island-ui/core'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (amount: number) => void
}

const AcceptModal = ({ onCancel, onSaveApplication }: Props) => {
  const maximumInputLength = 6
  const [amount, setAmount] = useState<number>(0)

  return (
    <InputModal
      headline="Umsóknin þín er samþykkt og áætlun er tilbúin"
      onCancel={onCancel}
      onSubmit={() => onSaveApplication(amount)}
      submitButtonText="Samþykkja"
    >
      <NumberInput
        placeholder="Skrifaðu upphæð útborgunar"
        onUpdate={setAmount}
        maximumInputLength={maximumInputLength}
      />
    </InputModal>
  )
}

export default AcceptModal
