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
      headline="Skrifaðu ástæðu höfnunar"
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
      errorMessage="Þú þarft að greina frá ástæðu höfnunar"
    >
      <Box marginBottom={2}>
        <Input
          label="Ástæða höfnunar"
          name="reasonForRejection"
          placeholder="Umsókn þinn um fjárhagsaðstoð hefur verið hafnað…"
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
        Þegar umsóknum er hafnað er hlekkur á slóð um reglur um fjárhagsaðstoð
        sveitarfélagsins birtur í tölvupósti sem er sendur á umsækjanda og á
        stöðusíðu. Í ástæðu höfnunar er því óhætt að vísa til reglna um
        fjárhagsaðstoð.
      </Text>
    </InputModal>
  )
}

export default RejectModal
