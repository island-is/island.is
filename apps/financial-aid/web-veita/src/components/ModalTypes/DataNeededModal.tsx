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

  console.log('comment', comment)

  return (
    <InputModal
      headline="Okkur vantar gögn til að klára að vinna úr umsókninni"
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
      errorMessage="Þú þarft að senda lýsingu"
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
