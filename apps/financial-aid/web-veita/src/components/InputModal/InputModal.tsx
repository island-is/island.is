import React, { useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'

import {
  NumberInput,
  CommentInput,
} from '@island.is/financial-aid-web/veita/src/components'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

interface Props {
  onShowInputChange(event: React.MouseEvent<HTMLButtonElement>): void
  type: ApplicationState | undefined
  onSaveState(
    event: React.MouseEvent<HTMLButtonElement>,
    amount: number,
    comment?: string,
  ): void
}

const InputModal = ({ onShowInputChange, type, onSaveState }: Props) => {
  const maximumInputLength = 6
  const [amount, setAmount] = useState<number>(0)

  const [comment, setComment] = useState<string>()

  const submitButtonText = (
    type: ApplicationState | undefined,
  ): string | undefined => {
    switch (type) {
      case ApplicationState.REJECTED:
        return 'Synja'
      case ApplicationState.APPROVED:
        return 'Samþykkja'
      case ApplicationState.DATANEEDED:
        return 'Senda á umsækjanda'
    }
  }

  return (
    <Box display="block" width="full" padding={4}>
      {type === ApplicationState.APPROVED && (
        <NumberInput
          placeholder="Skrifaðu upphæð útborgunar"
          onUpdate={setAmount}
          maximumInputLength={maximumInputLength}
        />
      )}

      {type === ApplicationState.REJECTED && (
        <CommentInput placeholder="Skrifaðu athugasemd" onUpdate={setComment} />
      )}

      {type === ApplicationState.DATANEEDED && (
        <CommentInput placeholder="Skrifaðu athugasemd" onUpdate={setComment} />
      )}

      <Box display="flex" justifyContent="spaceBetween" marginTop={5}>
        <Button variant="ghost" onClick={onShowInputChange}>
          Hætta við
        </Button>
        <Button onClick={(e) => onSaveState(e, amount, comment)}>
          {submitButtonText(type)}
        </Button>
      </Box>
    </Box>
  )
}

export default InputModal
