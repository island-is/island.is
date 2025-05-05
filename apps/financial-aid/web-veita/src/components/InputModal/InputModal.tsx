import React, { ReactNode } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { motion } from 'motion/react'
import cn from 'classnames'

interface Props {
  headline: string
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  onSubmit: () => void
  submitButtonText: string
  isModalVisable: boolean
  hasError: boolean
  errorMessage: string
}

const InputModal = ({
  headline,
  children,
  onCancel,
  onSubmit,
  submitButtonText,
  isModalVisable,
  hasError,
  errorMessage,
}: Props) => {
  return (
    <>
      {isModalVisable && (
        <motion.div
          data-testid="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Text variant="h3" marginBottom={4}>
            {headline}
          </Text>

          {children}

          <div
            className={cn({
              [`errorMessage `]: true,
              [`showErrorMessage`]: hasError,
            })}
          >
            <Text color="red600" fontWeight="semiBold" variant="small">
              {errorMessage}
            </Text>
          </div>

          <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
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
