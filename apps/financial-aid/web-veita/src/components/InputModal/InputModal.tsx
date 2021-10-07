import React, { ReactNode } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { motion } from 'framer-motion'

interface Props {
  headline: string
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  onSubmit: () => void
  submitButtonText: string
  isModalVisable: boolean
}

const InputModal = ({
  headline,
  children,
  onCancel,
  onSubmit,
  submitButtonText,
  isModalVisable,
}: Props) => {
  return (
    <>
      {isModalVisable && (
        <motion.div
          layoutId="inputmodal"
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
      )}
    </>
  )
}

export default InputModal
