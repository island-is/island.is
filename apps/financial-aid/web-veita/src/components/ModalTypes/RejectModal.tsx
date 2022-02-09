import React, { useState, useEffect, useRef } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box } from '@island.is/island-ui/core'
import * as styles from './ModalTypes.css'

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
  const ref = useRef<HTMLSpanElement>(null)
  const [hasError, setHasError] = useState(false)

  const setErrorFalse = () => {
    setHasError(false)
  }

  useEffect(() => {
    if (hasError) {
      ref.current?.addEventListener('input', setErrorFalse)
    }
    return () => {
      ref.current?.removeEventListener('input', setErrorFalse)
    }
  }, [hasError])

  return (
    <InputModal
      headline="Skrifaðu ástæðu synjunar"
      onCancel={onCancel}
      onSubmit={() => {
        if (!ref.current?.textContent) {
          setHasError(true)
          return
        }
        onSaveApplication(ref.current.textContent)
      }}
      submitButtonText="Synja og senda á umsækjanda"
      isModalVisable={isModalVisable}
      hasError={hasError}
      errorMessage="Þú þarft að greina frá ástæðu synjunar"
    >
      <Box marginBottom={[5, 5, 10]}>
        <Text variant="intro">
          Umsókn þinni um fjárhagsaðstoð í ágúst hefur verið synjað{' '}
          <span
            ref={ref}
            contentEditable="true"
            className={styles.rejectionEditable}
          />
          . Þú getur kynnt þér nánar reglur um fjárhagsaðstoð.
        </Text>
      </Box>
    </InputModal>
  )
}

export default RejectModal
