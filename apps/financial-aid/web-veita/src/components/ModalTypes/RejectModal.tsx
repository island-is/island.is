import React, { useState } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Input, Text, Box } from '@island.is/island-ui/core'
import cn from 'classnames'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (comment?: string) => void
  isModalVisable: boolean
}

const RejectModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
}: Props) => {
  const [comment, setComment] = useState<string>()
  const [hasError, setHasError] = useState(false)

  return (
    <InputModal
      headline="Umsókn þinni um aðstoð hefur verið synjað"
      onCancel={onCancel}
      onSubmit={() => {
        if (!comment) {
          setHasError(true)
          return
        }
        onSaveApplication(comment)
      }}
      submitButtonText="Synja og senda á umsækjanda"
      isModalVisable={isModalVisable}
      hasError={hasError}
      errorMessage="Þú þarft að greina frá ástæðu synjunar"
    >
      <Box marginBottom={2}>
        <Input
          label="Ástæða synjunar"
          name="reasonForRejection"
          placeholder="Umsókn þinni um fjárhagsaðstoð hefur verið synjað …"
          rows={4}
          value={comment}
          textarea
          backgroundColor="blue"
          onChange={(event) => {
            setComment(event.target.value)
            setHasError(false)
          }}
          hasError={hasError}
        />
      </Box>

      <Text variant="small" marginBottom={10}>
        Þegar umsóknum er synjað er hlekkur á slóð um reglur um fjárhagsaðstoð
        sveitarfélagsins birtur í tölvupósti sem er sendur á umsækjanda. Í
        ástæðu synjunar er því óhætt að vísa til reglna um fjárhagsaðstoð.
      </Text>
    </InputModal>
  )
}

export default RejectModal
