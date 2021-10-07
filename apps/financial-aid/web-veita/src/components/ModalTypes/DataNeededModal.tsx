import React, { useState } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Input, Text, Box } from '@island.is/island-ui/core'

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

  return (
    <InputModal
      headline="Okkur vantar gögn til að klára að vinna úr umsókninni"
      onCancel={onCancel}
      onSubmit={() => onSaveApplication(comment)}
      submitButtonText="Senda á umsækjanda"
      isModalVisable={isModalVisable}
    >
      <Box marginBottom={12}>
        <Input
          label="Lýsing"
          name="Test5"
          value={comment}
          placeholder="Skrifaðu skilaboð til umsækjanda"
          rows={4}
          textarea
          backgroundColor="blue"
          onChange={(event) => {
            event.stopPropagation()
            setComment(event.currentTarget.value)
          }}
        />
      </Box>
    </InputModal>
  )
}

export default DataNeededModal
