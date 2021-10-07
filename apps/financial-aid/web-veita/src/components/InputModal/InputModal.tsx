import React, { ReactNode, useState } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { AnimatePresence, motion } from 'framer-motion'

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
    <motion.div
      layoutId="modal"
      data-testid="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
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
    </motion.div>
  )
}

export default InputModal
