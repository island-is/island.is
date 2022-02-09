import React, { useState, useEffect, useCallback } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box } from '@island.is/island-ui/core'
import cn from 'classnames'
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
  const [comment, setComment] = useState<string>()
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (hasError) {
      const reasonForRejection = document.getElementById('reasonForRejection')
      reasonForRejection?.addEventListener('input', () => {
        setHasError(false)
      })
      return () => {
        document.removeEventListener('input', () => {
          setHasError(false)
        })
      }
    }
  }, [hasError])

  return (
    <InputModal
      headline="Skrifaðu ástæðu synjunar"
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
      <Box marginBottom={[5, 5, 10]}>
        <Text variant="intro">
          Umsókn þinni um fjárhagsaðstoð í ágúst hefur verið synjað{' '}
          <span
            id="reasonForRejection"
            contentEditable="true"
            className={styles.rejectionEditable}
          >
            {comment}
          </span>{' '}
          . Þú getur kynnt þér nánar reglur um fjárhagsaðstoð.
        </Text>
      </Box>
    </InputModal>
  )
}

export default RejectModal
