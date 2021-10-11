import React, { useState } from 'react'

import {
  InputModal,
  NumberInput,
} from '@island.is/financial-aid-web/veita/src/components'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'

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
      <NumberInput
        placeholder="Skrifaðu upphæð útborgunar"
        onUpdate={(input) => {
          setHasError(false)
          setAmount(input)
        }}
        maximumInputLength={maximumInputLength}
      />
    </InputModal>
  )
}

export default AcceptModal
