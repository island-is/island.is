import React, { ReactNode, useState } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'

interface Props {
  headline: string
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  onSubmit: () => void
  submitButtonText: string
}

const InputModal = ({
  headline,
  children,
  onCancel,
  onSubmit,
  submitButtonText,
}: Props) => {
  return (
    <>
      <Text variant="h3" marginBottom={2}>
        {headline}
      </Text>

      {children}

      <Box display="flex" justifyContent="spaceBetween" marginTop={5}>
        <Button variant="ghost" onClick={onCancel}>
          Hætta við
        </Button>
        <Button onClick={onSubmit}>{submitButtonText}</Button>
      </Box>
    </>
  )
}

export default InputModal
