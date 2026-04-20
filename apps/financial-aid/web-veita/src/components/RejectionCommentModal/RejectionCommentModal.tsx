import React from 'react'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './RejectionCommentModal.css'

import * as modalStyles from '../StateModal/StateModal.css'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  reason: string
}

const RejectionCommentModal = ({
  isVisible,
  onVisibilityChange,
  reason,
}: Props) => {
  const closeModal = (): void => {
    onVisibilityChange(false)
  }

  return (
    <ModalBase
      baseId="rejectionComment"
      modalLabel="Rejection Comment modal"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={modalStyles.modalBase}
    >
      <Box
        className={modalStyles.closeModalBackground}
        onClick={closeModal}
      ></Box>

      <Box className={modalStyles.modalContainer}>
        <Box
          position="relative"
          borderRadius="large"
          overflow="hidden"
          background="white"
          className={styles.modal}
        >
          <Box
            borderBottomWidth="standard"
            borderColor="blue200"
            marginBottom={2}
            paddingBottom={2}
          >
            <Text variant="h3">Ástæða synjunar</Text>
          </Box>

          <Text>
            <span
              dangerouslySetInnerHTML={{ __html: reason }}
              className="htmlReasonForRejection"
            ></span>
          </Text>

          <Box display="flex" justifyContent="flexEnd" marginTop={4}>
            <Button onClick={closeModal}>Loka</Button>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default RejectionCommentModal
