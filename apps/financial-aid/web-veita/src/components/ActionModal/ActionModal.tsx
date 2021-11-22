import React, { ReactNode } from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './ActionModal.css'
import StateModalContainer from '../StateModal/StateModalContainer'
import cn from 'classnames'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  header: string
  children: ReactNode
  errorMessage?: string
  hasError?: boolean
  submitButtonText: string
  onSubmit: () => void
}

const ActionModal = ({
  isVisible,
  setIsVisible,
  header,
  children,
  errorMessage,
  hasError,
  submitButtonText,
  onSubmit,
}: Props) => {
  return (
    <StateModalContainer
      isVisible={isVisible}
      onVisibilityChange={setIsVisible}
      closeModal={() => setIsVisible(false)}
    >
      <Box
        paddingLeft={4}
        paddingY={2}
        background="blue400"
        className={styles.modalHeadline}
      >
        <Text fontWeight="semiBold" color="white">
          {header}
        </Text>
      </Box>
      <Box padding={4}>
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

        <Box display="flex" justifyContent="spaceBetween" marginTop={5}>
          <Button variant="ghost" onClick={() => setIsVisible(false)}>
            Hætta við
          </Button>
          <Button onClick={onSubmit}>{submitButtonText}</Button>
        </Box>
      </Box>
    </StateModalContainer>
  )
}

export default ActionModal
