import React, { useState } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Input, Box } from '@island.is/island-ui/core'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (comment?: string) => void
  isModalVisable: boolean
}

const DataNeededModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
}: Props) => {
  const [comment, setComment] = useState<string>()
  const [hasError, setHasError] = useState(false)

  return (
    <InputModal
      headline="Listaðu upp þau gögn sem vantar"
      onCancel={onCancel}
      onSubmit={() => {
        if (!comment) {
          setHasError(true)
          return
        }
        onSaveApplication(comment)
      }}
      submitButtonText="Senda á umsækjanda"
      isModalVisable={isModalVisable}
      hasError={hasError}
      errorMessage="Þú þarft að gera grein fyrir hvaða gögn vanti í umsóknina"
    >
      <Box marginBottom={12}>
        <Input
          label="Lýsing"
          name="Test5"
          value={comment}
          placeholder="Til að klára umsóknina verður þú að senda okkur..."
          rows={4}
          textarea
          backgroundColor="blue"
          onChange={(event) => {
            setHasError(false)
            setComment(event.currentTarget.value)
          }}
          hasError={hasError}
        />
      </Box>
    </InputModal>
  )
}

export default DataNeededModal
